import supabase from '../services/supabaseClient'
import { v4 as uuidv4 } from 'uuid';


export async function fetchRandomWords(limit = 100) {
  try {
    const { count } = await supabase
      .from('english-word')
      .select('*', { count: 'exact', head: true });

    const maxStart = Math.max(0, count - limit);
    const start = Math.floor(Math.random() * maxStart);
    
    const { data, error } = await supabase
      .from('english-word')
      .select('id, Word')
      .range(start, start + limit - 1);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching words:', error);
    return [];
  }
}


export async function getUserMetadata() {
  try {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    
    return {
      browser: userAgent,
      platform: platform,
      ip: ipData.ip,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting user metadata:', error);
    return {
      browser: navigator.userAgent,
      platform: navigator.platform,
      timestamp: new Date().toISOString()
    };
  }
}

export async function fetchWords(limit = 200) {
    try {
        const userMetadata = await getUserMetadata();
    
        const { data: userContributedWords, error: fetchError } = await supabase
        .from('esimbi-pronunciation')
        .select('word')
        .eq('ip_addr', userMetadata.ip);
    
        if (fetchError) throw fetchError;
        const contributedWords = userContributedWords.map(record => record.word);    
    
        const { data, error } = await supabase
        .from('english-word')
        .select('id, Word')
        .not('Word', 'in', `(${contributedWords.join(',')})`)
        .range(0, limit - 1);
    
        if (error) throw error;
    
        return data;
    
    } catch (error) {
        console.error('Error fetching words:', error);
        return [];
    }
    }

export async function uploadAllRecordings(recordingsMap) {
    const userMetadata = await getUserMetadata();
    
    const uploadPromises = [];


    for (const [wordId, { word, recordings }] of Object.entries(recordingsMap)) {
        if (!recordings || recordings.length === 0) continue;
        
        const uploadPromise = processRecording(wordId, word, recordings, userMetadata);
        uploadPromises.push(uploadPromise);

    }

    
    const results = await Promise.allSettled(uploadPromises);
    
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
        console.log("upload failed :", failed)
      console.error(`${failed.length} out of ${results.length} uploads failed`);
      throw new Error(`Failed to upload ${failed.length} recordings`);
    }
    
    return results.filter(r => r.status === 'fulfilled').map(r => r.value);
  }

async function processRecording(wordId, word, blobs, userMetadata) {
    try {
      const uploadPromises = blobs.map(async (blob, index) => {
        const uniqueId = uuidv4();
        const fileName = `${word}_${wordId}_${Date.now()}_${uniqueId}.webm`;
  
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('esimbi-pronunciation')
          .upload(fileName, blob, {
            cacheControl: '3600',
            contentType: 'audio/webm',
          });
  
        if (uploadError) throw uploadError;
  
        const { data: { publicUrl } } = supabase
          .storage
          .from('esimbi-pronunciation')
          .getPublicUrl(fileName);
  
        if (!publicUrl) throw new Error('Failed to get public URL');
  
        return publicUrl;
      });
  
      const audioUrls = await Promise.all(uploadPromises);
  
      const { data: insertData, error: insertError } = await supabase
        .from('esimbi-pronunciation')
        .insert([
          {
            word: word,
            audio_url: audioUrls,
            user_metadata: userMetadata,
            ip_addr: userMetadata.ip
          }
        ]);
  
      if (insertError) throw insertError;
  
      return insertData;
    } catch (error) {
      console.error(`Error processing recordings for word ${wordId}:`, error);
      throw error;
    }
  }
  