import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    
    // Initialize Supabase client with environment variables
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    
    // Insert email into waitlist table
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ 
        email, 
        created_at: new Date().toISOString(),
        ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress 
      }]);
      
    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
        return res.status(409).json({ error: 'This email is already in our waitlist.' });
      }
      throw error;
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Successfully added to waitlist!' 
    });
    
  } catch (error) {
    console.error('Error in waitlist API:', error);
    return res.status(500).json({ 
      error: 'Error adding to waitlist. Please try again later.' 
    });
  }
}
