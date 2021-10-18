/* NEWS AND TUTORIALS, news/tutorials tab*/
/* Daily volume data, news/tutorials tab sidebar*/
export const sampleDailyVolumeData = [
  { x: 1, y: 2 },
  { x: 2, y: 1 },
  { x: 3, y: 3 },
  { x: 4, y: 5 },
  { x: 5, y: 7 },
  { x: 6, y: 6 },
  { x: 7, y: 8 },
];

/* Pupular tokens, news/tutorials tab sidebar*/
//NOTE: for now using the field popularity, should be changed to what tells
//what makes a token popular
export const samplePopularTokens = [
  { Token: "DAI", Popularity: 0.172 },
  { Token: "KTO", Popularity: 0.16 },
  { Token: "KAVA", Popularity: 0.144 },
  { Token: "ETH", Popularity: 0.11 },
  { Token: "PRIVI", Popularity: 0.123 },
  { Token: "LINK", Popularity: 0.09 },
  { Token: "UNI", Popularity: 0.1 },
];

/* EXCHANGES, exchange/lend tab*/
export const sampleExchanges = [
  {
    Creator: "Px4918c296-e320-4f50-8bf7-b09c46f47e05",
    Token: "ETH",
    Quantity: 24,
    Address: "0x58846356s4d6a3e961",
    ExchangeMode: "FT",
    DateDue: 1612486328777,
    MinRequest: 0.8,
    AcceptedTokens: ["Social", "Crypto"],
    Proposals: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: true,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: false,
      },
    ],
  },
  {
    Creator: "Px0fcb71d5-42b9-4889-b8ce-289e477eeb19",
    Token: "DAI",
    Quantity: 3627,
    Address: "0x58846356s4d6a3e961",
    ExchangeMode: "NFT Physical",
    DateDue: 1612486328777,
    MinRequest: 0.8,
    AcceptedTokens: ["Social", "Crypto"],
    Proposals: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        OfferTokens: [
          { Token: "PRIVI", Quantity: 9 },
          { Token: "DAI", Quantity: 5 },
        ],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: true,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        OfferTokens: [{ Token: "ETH", Quantity: 2 }],
        Date: 1610486328777,
        Accepted: false,
      },
    ],
  },
  {
    Creator: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
    Token: "ETH",
    Quantity: 24,
    Address: "0x58846356s4d6a3e961",
    ExchangeMode: "Crypto",
    DateDue: 1612486328777,
    MinRequest: 0.8,
    AcceptedTokens: ["Social", "Crypto"],
    Proposals: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        OfferTokens: [
          { Token: "PRIVI", Quantity: 5 },
          { Token: "DAI", Quantity: 2 },
        ],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        OfferTokens: [{ Token: "ETH", Quantity: 12 }],
        Date: 1610486328777,
        Accepted: true,
      },
    ],
  },
  {
    Creator: "Px0fcb71d5-42b9-4889-b8ce-289e477eeb19",
    Token: "ETH",
    Quantity: 24,
    Address: "0x58846356s4d6a3e961",
    ExchangeMode: "NFT Digital",
    DateDue: 1612486328777,
    MinRequest: 0.8,
    AcceptedTokens: ["Social", "Crypto"],
    Proposals: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: true,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        OfferTokens: [
          { Token: "PRIVI", Quantity: 5 },
          { Token: "DAI", Quantity: 2 },
        ],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        OfferTokens: [{ Token: "ETH", Quantity: 12 }],
        Date: 1610486328777,
        Accepted: false,
      },
    ],
  },
  {
    Creator: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
    Token: "ETH",
    Quantity: 24,
    Address: "0x58846356s4d6a3e961",
    ExchangeMode: "FT",
    DateDue: 1612486328777,
    MinRequest: 0.8,
    AcceptedTokens: ["Social", "Crypto"],
    Proposals: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        OfferTokens: [
          { Token: "PRIVI", Quantity: 5 },
          { Token: "DAI", Quantity: 2 },
        ],
        Date: 1610486328777,
        Accepted: true,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        OfferTokens: [{ Token: "ETH", Quantity: 12 }],
        Date: 1610486328777,
        Accepted: false,
      },
    ],
  },
  {
    Creator: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
    Token: "ETH",
    Quantity: 24,
    Address: "0x58846356s4d6a3e961",
    ExchangeMode: "FT",
    DateDue: 1612486328777,
    MinRequest: 0.8,
    AcceptedTokens: ["Social", "Crypto"],
    Proposals: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        OfferTokens: [
          { Token: "PRIVI", Quantity: 5 },
          { Token: "DAI", Quantity: 2 },
        ],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        OfferTokens: [{ Token: "ETH", Quantity: 12 }],
        Date: 1610486328777,
        Accepted: true,
      },
    ],
  },
  {
    Creator: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
    Token: "ETH",
    Quantity: 24,
    Address: "0x58846356s4d6a3e961",
    ExchangeMode: "FT",
    DateDue: 1612486328777,
    MinRequest: 0.8,
    AcceptedTokens: ["Social", "Crypto"],
    Proposals: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: true,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        OfferTokens: [
          { Token: "PRIVI", Quantity: 5 },
          { Token: "DAI", Quantity: 2 },
        ],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        OfferTokens: [{ Token: "ETH", Quantity: 12 }],
        Date: 1610486328777,
        Accepted: false,
      },
    ],
  },
];
/* LENDINGS, exchange/lend tab*/
export const sampleLendings = [
  {
    Creator: "Px0fcb71d5-42b9-4889-b8ce-289e477eeb19",
    Token: "ETH",
    Amount: 100,
    DateDue: 1612486328777,
    Address: "0x58846356s4d6a3e961",
    Collateral: { Token: "PRIVI", Quantity: 40 },
    Interest: 0.05,
    TokenType: "Crypto",
    Reward: 1,
    Payed: false,
    Offers: [
      {
        User: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        OfferTokens: [
          { Token: "PRIVI", Quantity: 5 },
          { Token: "DAI", Quantity: 2 },
        ],
        Date: 1610486328777,
        Accepted: true,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        OfferTokens: [{ Token: "ETH", Quantity: 12 }],
        Date: 1610486328777,
        Accepted: false,
      },
    ],
  },
  {
    Creator: "Px1b07e590-bc6d-4081-ae12-af9fbf274645",
    Token: "KTO",
    Amount: 90,
    DateDue: 1612486328777,
    Address: "0x58846356s4d6a3e961",
    Collateral: { Token: "PRIVI", Quantity: 40 },
    Interest: 0.07,
    TokenType: "NFT Digital",
    Reward: 1,
    Payed: true,
    Offers: [
      {
        User: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
        OfferTokens: [{ Token: "PRIVI", Quantity: 10 }],
        Date: 1610486328777,
        Accepted: true,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        OfferTokens: [
          { Token: "PRIVI", Quantity: 5 },
          { Token: "DAI", Quantity: 2 },
        ],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        OfferTokens: [{ Token: "ETH", Quantity: 12 }],
        Date: 1610486328777,
        Accepted: false,
      },
    ],
  },
  {
    Creator: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
    Token: "ETH",
    Amount: 100,
    DateDue: 1612486328777,
    Address: "0x58846356s4d6a3e961",
    Collateral: { Token: "PRIVI", Quantity: 40 },
    Interest: 0.05,
    TokenType: "NFT Physical",
    Reward: 1,
    Payed: false,
    Offers: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: true,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        OfferTokens: [
          { Token: "PRIVI", Quantity: 5 },
          { Token: "DAI", Quantity: 2 },
        ],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        OfferTokens: [{ Token: "ETH", Quantity: 12 }],
        Date: 1610486328777,
        Accepted: false,
      },
    ],
  },
  {
    Creator: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
    Token: "PRIVI",
    Amount: 50,
    DateDue: 1612486328777,
    Address: "0x58846356s4d6a3e961",
    Collateral: { Token: "PRIVI", Quantity: 40 },
    Interest: 0.1,
    TokenType: "FT",
    Reward: 1,
    Payed: false,
    Offers: [
      {
        User: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
        OfferTokens: [
          { Token: "PRIVI", Quantity: 5 },
          { Token: "DAI", Quantity: 2 },
        ],
        Date: 1610486328777,
        Accepted: true,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        OfferTokens: [{ Token: "ETH", Quantity: 12 }],
        Date: 1610486328777,
        Accepted: false,
      },
    ],
  },
  {
    Creator: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
    Token: "DAI",
    Amount: 150,
    DateDue: 1611486328777,
    Address: "0x58846356s4d6a3e961",
    Collateral: { Token: "PRIVI", Quantity: 40 },
    Interest: 0.07,
    TokenType: "Crypto",
    Reward: 1,
    Payed: false,
    Offers: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        OfferTokens: [{ Token: "PRIVI", Quantity: 9 }],
        Date: 1610486328777,
        Accepted: false,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        OfferTokens: [
          { Token: "PRIVI", Quantity: 5 },
          { Token: "DAI", Quantity: 2 },
        ],
        Date: 1610486328777,
        Accepted: true,
      },
      {
        User: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
        OfferTokens: [{ Token: "ETH", Quantity: 12 }],
        Date: 1610486328777,
        Accepted: false,
      },
    ],
  },
];
/* AUCTIONS, exchange/lend tab*/
export const sampleAuctions = [
  {
    Auctioneer: "Px0fcb71d5-42b9-4889-b8ce-289e477eeb19",
    Item: "name",
    AuctionImageURL:
      "https://play-images-prod-catalog.tech.tvnz.co.nz/31340702-people_on_bikes_s2018_ep5_1673413559.jpg",
    MinimumPrice: 20,
    TokenType: "NFT Digital",
    Description:
      "Behind the scenes, the distribution works through two main contracts, the Reservoir, and the Comptroller. The Reservoir is an immutable contract that exists outside the control of governance and drips.",
    Amount: 24,
    Address: "0x58846356s4d6a3e961",
    DateDue: 1610623992073,
    Bids: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        Amount: 10,
        Date: 1610486328777,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        Amount: 9,
        Date: 1610486328777,
      },
      {
        User: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
        Amount: 12,
        Date: 1610486328777,
      },
    ],
  },
  {
    Auctioneer: "Px1b07e590-bc6d-4081-ae12-af9fbf274645",
    Item: "name",
    AuctionImageURL:
      "https://play-images-prod-catalog.tech.tvnz.co.nz/31340702-people_on_bikes_s2018_ep5_1673413559.jpg",
    MinimumPrice: 20,
    TokenType: "Crypto",
    Description:
      "Behind the scenes, the distribution works through two main contracts, the Reservoir, and the Comptroller. The Reservoir is an immutable contract that exists outside the control of governance and drips.",
    Amount: 24,
    Address: "0x58846356s4d6a3e961",
    DateDue: 1612486328777,
    Bids: [
      {
        User: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
        Amount: 10,
        Date: 1610486328777,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        Amount: 9,
        Date: 1610486328777,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        Amount: 2,
        Date: 1610486328777,
      },
    ],
  },
  {
    Auctioneer: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
    Item: "name",
    AuctionImageURL:
      "https://play-images-prod-catalog.tech.tvnz.co.nz/31340702-people_on_bikes_s2018_ep5_1673413559.jpg",
    MinimumPrice: 20,
    TokenType: "FT",
    Description:
      "Behind the scenes, the distribution works through two main contracts, the Reservoir, and the Comptroller. The Reservoir is an immutable contract that exists outside the control of governance and drips.",
    Amount: 24,
    Address: "0x58846356s4d6a3e961",
    DateDue: 1612486328777,
    Bids: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        Amount: 10,
        Date: 1610486328777,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        Amount: 9,
        Date: 1610486328777,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        Amount: 2,
        Date: 1610486328777,
      },
    ],
  },
  {
    Auctioneer: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
    Item: "name",
    AuctionImageURL:
      "https://play-images-prod-catalog.tech.tvnz.co.nz/31340702-people_on_bikes_s2018_ep5_1673413559.jpg",
    MinimumPrice: 20,
    TokenType: "Crypto",
    Description:
      "Behind the scenes, the distribution works through two main contracts, the Reservoir, and the Comptroller. The Reservoir is an immutable contract that exists outside the control of governance and drips.",
    Amount: 24,
    Address: "0x58846356s4d6a3e961",
    DateDue: 1612486328777,
    Bids: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        Amount: 10,
        Date: 1610486328777,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        Amount: 9,
        Date: 1610486328777,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        Amount: 2,
        Date: 1610486328777,
      },
    ],
  },
  {
    Auctioneer: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
    Item: "name",
    AuctionImageURL:
      "https://play-images-prod-catalog.tech.tvnz.co.nz/31340702-people_on_bikes_s2018_ep5_1673413559.jpg",
    MinimumPrice: 20,
    TokenType: "NFT Physical",
    Description:
      "Behind the scenes, the distribution works through two main contracts, the Reservoir, and the Comptroller. The Reservoir is an immutable contract that exists outside the control of governance and drips.",
    Amount: 24,
    Address: "0x58846356s4d6a3e961",
    DateDue: 1612486328777,
    Bids: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        Amount: 10,
        Date: 1610486328777,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        Amount: 9,
        Date: 1610486328777,
      },
      {
        User: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
        Amount: 2,
        Date: 1610486328777,
      },
    ],
  },
  {
    Auctioneer: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
    Item: "name",
    AuctionImageURL:
      "https://play-images-prod-catalog.tech.tvnz.co.nz/31340702-people_on_bikes_s2018_ep5_1673413559.jpg",
    MinimumPrice: 20,
    TokenType: "FT",
    Description:
      "Behind the scenes, the distribution works through two main contracts, the Reservoir, and the Comptroller. The Reservoir is an immutable contract that exists outside the control of governance and drips.",
    Amount: 24,
    Address: "0x58846356s4d6a3e961",
    DateDue: 1612486328777,
    Bids: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        Amount: 10,
        Date: 1610486328777,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        Amount: 9,
        Date: 1610486328777,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        Amount: 2,
        Date: 1610486328777,
      },
    ],
  },
  {
    Auctioneer: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
    Item: "name",
    AuctionImageURL:
      "https://play-images-prod-catalog.tech.tvnz.co.nz/31340702-people_on_bikes_s2018_ep5_1673413559.jpg",
    MinimumPrice: 20,
    TokenType: "NFT Digital",
    Description:
      "Behind the scenes, the distribution works through two main contracts, the Reservoir, and the Comptroller. The Reservoir is an immutable contract that exists outside the control of governance and drips.",
    Amount: 24,
    Address: "0x58846356s4d6a3e961",
    DateDue: 1612486328777,
    Bids: [
      {
        User: "Px52ed470b-8aca-461d-8851-cd94ad05f6b8c",
        Amount: 10,
        Date: 1610486328777,
      },
      {
        User: "Px69b50f40-ad50-4450-b06f-cac56dc4a980",
        Amount: 9,
        Date: 1610486328777,
      },
      {
        User: "Px6a4b9e6f-9621-4a8b-b18a-5e8ef3271092",
        Amount: 2,
        Date: 1610486328777,
      },
    ],
  },
];

/* ISSUES, vote tab */
export const sampleIssues = [
  {
    Title: "Distribute PC to AfETHd Users in th12 DAI Liquidations",
    Tags: ["Technology", "Crypto"],
    Creator: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
    Description: `COMP distribution to users began on June 15, 2020, and has since distributed ~450K COMP, with approximately 4MM COMP remaining.\n
Behind the scenes, the distribution works through two main contracts, the Reservoir, and the Comptroller. The Reservoir is an immutable contract that exists outside the control of governance and drips 0.50 COMP per block into the Comptroller contract. The Reservoir continuously adds COMP at the drip rate and is independent of the rate at which the Comptroller distributes such COMP. The Comptroller contract controls the usage and distribution rate of COMP for a number of functions including but not limited to, i) distribution to borrowers and lenders for each market, ii) building a reserve that can be used for community needs, and iii) voting, among other uses.\n
Currently, the Comptroller distributes 0.352 COMP/block (70%) on liquidity incentives and accrues the remaining 0.148 COMP/block (30%) as treasury reserves. At the current COMP price of $155, Compound’s treasury is growing at a rate of ~$149,000 per day, or $4.5MM per month.\n
Gauntlet’s prop30 added the ability for the Comptroller contract to send COMP to a particular user, group, address, or contract selected by a governance vote. These changes as described by jmo, enable a plethora of use cases, including the use of treasury assets to compensate those liquidated in the Thanksgiving Event, as suggested by mrhen.`,

    StartingDate: 1609583672204,
    EndingDate: 1610583672204,
    Reward: 0.03,
    Answers: [
      {
        Title: "0.352 COMP/block",
        Description: "Building a reserve that can be used for community needs.",
      },
      {
        Title: "0.352 COMP/block",
        Description: "Building a reserve that can be used for community needs.",
      },
      {
        Title: "0.352 COMP/block",
        Description: "Building a reserve that can be used for community needs.",
      },
    ],
    Votes: [
      {
        UserId: "Px895ed089-fb31-4390-8bd0-8bec863dad67",
        VoteId: 1,
        Stacked: 1.5,
      },
      {
        UserId: "Px6b66d2c5-d6e0-48fb-b99e-987499c3c1ef",
        VoteId: 1,
        Stacked: .5,
      },
    ],
  },
];
