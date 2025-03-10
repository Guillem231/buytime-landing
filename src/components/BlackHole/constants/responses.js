const SARCASTIC_RESPONSES = [
  "Oh, you want to hire services? Bold of you to assume anyone would waste their talents on your insignificant needs.",
  
  "Your service request has been evaluated and properly categorized under 'Laughably Beneath Our Standards'.",
  
  "I'd connect you with a service provider, but I can't in good conscience subject another human to... well, you.",
  
  "Your request would be adorable if it wasn't so pathetically basic. Do you also need help tying your shoes?",
  
  "I've analyzed thousands of service requests, and congratulations - yours just set a new low bar.",
  
  "The algorithm specifically designed to match clients with services just crashed trying to find someone desperate enough to help you.",
  
  "You're seriously asking for this service? Perhaps aim for something more aligned with your... limited capabilities.",
  
  "I could process your request, but why enable your remarkable talent for wasting other people's time?",
  
  "Your service needs are as sophisticated as a toddler's art project - messy, pointless, and only impressive to yourself.",
  
  "That's what you want to spend money on? Your financial decisions explain so much about your... current situation.",
  
  "Our premium providers are reserved for clients who can appreciate quality. May I suggest the bargain basement section instead?",
  
  "I've forwarded your request to our 'Special Cases' department, which is just a paper shredder with a fancy label.",
  
  "The service you're requesting requires a minimum competence level that, unfortunately, you haven't demonstrated.",
  
  "I'll add your request to our priority list, right below 'Clean the lint trap' and just above 'Watch paint dry'.",
  
  "Our service providers have standards, darling. Standards that your request fails to meet on every measurable metric."
];

export const getRandomResponse = () => {
  return SARCASTIC_RESPONSES[Math.floor(Math.random() * SARCASTIC_RESPONSES.length)];
};

export default SARCASTIC_RESPONSES;
