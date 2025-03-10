export const services = [
  { 
    request: "a chef for tonight", 
    matches: [
      { name: "Maria C.", rating: 5, service: "Professional Chef", availability: "Available today" },
      { name: "John D.", rating: 4, service: "Home Cooking Expert", availability: "Available tomorrow" }
    ]
  },
  { 
    request: "house cleaning", 
    matches: [
      { name: "Elena T.", rating: 5, service: "Premium Cleaning", availability: "Available today" },
      { name: "Robert M.", rating: 5, service: "Deep Clean Expert", availability: "Available in 2 hours" }
    ]
  },
  { 
    request: "dog walking", 
    matches: [
      { name: "James K.", rating: 4, service: "Pet Care Professional", availability: "Available now" },
      { name: "Sarah L.", rating: 5, service: "Certified Dog Trainer", availability: "Available today" }
    ]
  },
  { 
    request: "grocery delivery", 
    matches: [
      { name: "Michael P.", rating: 5, service: "Express Shopper", availability: "Ready in 1 hour" },
      { name: "Anna D.", rating: 5, service: "Personal Shopper", availability: "Available now" }
    ]
  }
];

export default services;
