const OpenType = {
  Home : "HOME",
  Playlist : "PLAYLIST",
  Album : "ALBUM",
  Artist : "ARTIST",
  Liked : "LIKED",
  Library : "LIBRARY",
  Search : "SEARCH",
  Queue : "QUEUE",
}

export const albumsMock = [
  {
    id: "album1",
    ImageUrl: "https://source.unsplash.com/random/1",
    Title: "Album title",
    Description: "Album description or creator name.",
    Year: 2021,
    Type: OpenType.Album,
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg"),
      id: "artist1",
    },
    Songs: [
      {
        id: "song1",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
        Duration: 605,
        ImageUrl: "https://source.unsplash.com/random/1",
      },
      {
        id: "song2",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",

        Duration: 605,
      },
      {
        id: "song3",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",

        Duration: 605,
      },
      {
        id: "song4",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",

        Duration: 605,
      },
      {
        id: "song5",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",

        Duration: 605,
      },
    ],
  },
  {
    id: "album2",
    ImageUrl: "https://source.unsplash.com/random/2",
    Title: "Album title",
    Description: "Album description or creator name.",
    Year: 2021,
    Type: OpenType.Album,
    Songs: [
      {
        id: "song",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",

        Duration: 605,
      },
    ],
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_002.jpg"),
      id: "artist2",
    },
  },
  {
    id: "album3",
    ImageUrl: "https://source.unsplash.com/random/3",
    Title: "Album title",
    Description: "Album description or creator name.",
    Year: 2021,
    Type: OpenType.Album,
    Songs: [
      {
        id: "song",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",

        Duration: 605,
      },
    ],
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_003.jpg"),
      id: "artist3",
    },
  },
  {
    id: "album4",
    ImageUrl: "https://source.unsplash.com/random/4",
    Title: "Album title",
    Description: "Album description or creator name.",
    Year: 2021,
    Type: OpenType.Album,
    Songs: [
      {
        id: "song",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",

        Duration: 605,
      },
    ],
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_004.jpg"),
      id: "artist4",
    },
  },
  {
    id: "album5",
    ImageUrl: "https://source.unsplash.com/random/5",
    Title: "Album title",
    Description: "Album description or creator name.",
    Year: 2021,
    Type: OpenType.Album,
    Songs: [
      {
        id: "song",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",

        Duration: 605,
      },
    ],
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_005.jpg"),
      id: "artist5",
    },
  },
  {
    id: "album6",
    ImageUrl: "https://source.unsplash.com/random/6",
    Title: "Album title",
    Description: "Album description or creator name.",
    Year: 2021,
    Type: OpenType.Album,
    Songs: [
      {
        id: "song",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",

        Duration: 605,
      },
    ],
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_006.jpg"),
      id: "artist6",
    },
  },
];

export const playlistMock = [
  {
    id: "playlist1",
    ImageUrl: "https://source.unsplash.com/random/7",
    Title: "Playlist name",
    Description: "Playlist description or creator name.",
    Year: 2021,
    Type: OpenType.Playlist,
    Songs: [
      {
        id: "song",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",

        Duration: 605,
      },
    ],
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_007.jpg"),
      id: "artist1",
    },
  },
  {
    id: "playlist2",
    ImageUrl: "https://source.unsplash.com/random/8",
    Title: "Playlist name",
    Description: "Playlist description or creator name.",
    Year: 2021,
    Type: OpenType.Playlist,
    Songs: [
      {
        id: "song",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",

        Duration: 605,
      },
    ],
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_008.jpg"),
      id: "artist2",
    },
  },
  {
    id: "playlist3",
    ImageUrl: "https://source.unsplash.com/random/9",
    Title: "Playlist name",
    Description: "Playlist description or creator name.",
    Year: 2021,
    Type: OpenType.Playlist,
    Songs: [
      {
        id: "song",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",

        Duration: 605,
      },
    ],
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_009.jpg"),
      id: "artist3",
    },
  },
  {
    id: "playlist4",
    ImageUrl: "https://source.unsplash.com/random/10",
    Title: "Playlist name",
    Description: "Playlist description or creator name.",
    Year: 2021,
    Type: OpenType.Playlist,
    Songs: [
      {
        id: "song",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",

        Duration: 605,
      },
    ],
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_010.jpg"),
      id: "artist4",
    },
  },
  {
    id: "playlist5",
    ImageUrl: "https://source.unsplash.com/random/11",
    Title: "Playlist name",
    Description: "Playlist description or creator name.",
    Year: 2021,
    Type: OpenType.Playlist,
    Songs: [
      {
        id: "song",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",

        Duration: 605,
      },
    ],
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_011.jpg"),
      id: "artist5",
    },
  },
  {
    id: "playlist6",
    ImageUrl: "https://source.unsplash.com/random/12",
    Title: "Playlist name",
    Description: "Playlist description or creator name.",
    Year: 2021,
    Type: OpenType.Playlist,
    Songs: [
      {
        id: "song",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",

        Duration: 605,
      },
    ],
    Artist: {
      Name: "Artist Name",
      ImageUrl: require("assets/anonAvatars/ToyFaces_Colored_BG_012.jpg"),
      id: "artist6",
    },
  },
];

export const queueMock = [
  {
    id: "song1",
    Title: "title of the song",
    Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    Duration: 605,
    ImageUrl: "https://source.unsplash.com/random/1",
  },
  {
    id: "song2",
    Title: "title of the song",
    Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",

    Duration: 605,
  },
  {
    id: "song3",
    Title: "title of the song",
    Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",

    Duration: 605,
  },
  {
    id: "song4",
    Title: "title of the song",
    Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",

    Duration: 605,
  },
  {
    id: "song5",
    Title: "title of the song",
    Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",

    Duration: 605,
  },
];

export const genresMock = [
  {
    Name: "Rock",
    ImageUrl:
      "https://phantom-marca.unidadeditorial.es/5e4f1fe0593b6ddf25c9b72ed8627b7e/resize/1320/f/jpg/assets/multimedia/imagenes/2021/05/24/16218791118475.jpg",
  },
  {
    Name: "Indie",
    ImageUrl: "https://www.eluniversal.com.mx/sites/default/files/2019/08/22/pro_indie_music.jpg",
  },
  {
    Name: "Jazz",
    ImageUrl: "https://i.pinimg.com/originals/db/f5/72/dbf572769b61792ce83619a8b96823ef.jpg",
  },

  {
    Name: "Hip Hop",
    ImageUrl:
      "https://static.straitstimes.com.sg/s3fs-public/styles/xxx_large/public/articles/2016/04/13/st_20160413_lifshigga_2210478.jpg?itok=WOAgchNx&timestamp=1460478199",
  },

  {
    Name: "Pop",
    ImageUrl: "https://aws.glamour.mx/prod/designs/v1/assets/1170x614/247476.jpg",
  },

  {
    Name: "R&B",
    ImageUrl:
      "https://los40es00.epimg.net/los40/imagenes/2019/04/30/musica/1556641812_337403_1556641947_noticia_normal.jpg",
  },
];

export const exploreMock = [
  {
    Name: "Podcast",
    ImageUrl:
      "https://blog.corp-site.envato.com/cdn-cgi/image/width=1200,quality=95,format=auto/uploads/2020/05/SOC085-Top-10-Podcast-Music-Tracks-2020.jpg",
  },
  {
    Name: "Just for you",
    ImageUrl: "https://pbs.twimg.com/profile_images/1061810617739345920/exSFGljS.jpg",
  },
  {
    Name: "Hits",
    ImageUrl: "https://i.pinimg.com/originals/c3/94/cf/c394cf4a80d957d664343e338a32ba32.jpg",
  },
  { Name: `What's new?`, ImageUrl: "https://pbs.twimg.com/media/CY8hLC9WAAAanHz.jpg" },
  {
    Name: "Find out",
    ImageUrl: "https://i.pinimg.com/originals/1a/d7/f0/1ad7f0c78859a871347dd732cfd2b76e.jpg",
  },
  {
    Name: "Concerts",
    ImageUrl:
      "https://d2cyzdatssrhg7.cloudfront.net/export/sites/default/ets/.content/venues/img/00-00085DW.jpg?__locale=es",
  },
  {
    Name: "State of mind",
    ImageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7ky9IWM8MJDXj-ucTSbomlwaZGwqk6ACz6Q&usqp=CAU",
  },
  {
    Name: "Relax",
    ImageUrl: "https://i.pinimg.com/originals/26/41/6f/26416f474b0f10990fe06de99bd751cf.jpg",
  },
  {
    Name: "Hip Hop",
    ImageUrl:
      "https://static.straitstimes.com.sg/s3fs-public/styles/xxx_large/public/articles/2016/04/13/st_20160413_lifshigga_2210478.jpg?itok=WOAgchNx&timestamp=1460478199",
  },
  { Name: "At Home", ImageUrl: "https://data.whicdn.com/images/351773689/original.jpg?t=1609016037" },
  {
    Name: "Dance",
    ImageUrl: "https://i.pinimg.com/originals/a0/7f/b2/a07fb2e4eb81e12c6bb8599e2bce2c9f.jpg",
  },
  {
    Name: "Party",
    ImageUrl: "https://i.pinimg.com/originals/0a/30/1e/0a301e707b429aec92a9652c94e54d5c.jpg",
  },
];

export const artistsMock = [
  {
    id: "artist1",
    ImageUrl: "https://source.unsplash.com/random/13",
    ImageUrl2: "https://source.unsplash.com/random/14",
    Name: "Artist 1 Name",
    About: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged`,
    Followers: 10000,
    Type: OpenType.Artist,
    MonthlyListeners: 100000,
    Songs: [
      {
        id: "song1",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
        Duration: 605,
        ImageUrl: "https://source.unsplash.com/random/1",
      },
      {
        id: "song2",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        Duration: 605,
      },
      {
        id: "song3",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        Duration: 605,
      },
      {
        id: "song4",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        Duration: 605,
      },
      {
        id: "song5",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        Duration: 605,
      },
    ],
  },
  {
    id: "artist2",
    ImageUrl: "https://source.unsplash.com/random/15",
    ImageUrl2: "https://source.unsplash.com/random/16",
    Name: "Artist 2 Name",
    About: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged`,
    Followers: 100,
    Type: OpenType.Artist,
    MonthlyListeners: 10024000,
    Songs: [
      {
        id: "song1",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
        Duration: 605,
        ImageUrl: "https://source.unsplash.com/random/1",
      },
      {
        id: "song2",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        Duration: 605,
      },
      {
        id: "song3",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        Duration: 605,
      },
      {
        id: "song4",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        Duration: 605,
      },
      {
        id: "song5",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        Duration: 605,
      },
    ],
  },
  {
    id: "artist3",
    ImageUrl: "https://source.unsplash.com/random/17",
    ImageUrl2: "https://source.unsplash.com/random/18",
    Name: "Artist 3 Name",
    About: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged`,
    Followers: 3000,
    Type: OpenType.Artist,
    MonthlyListeners: 100452000,
    Songs: [
      {
        id: "song1",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
        Duration: 605,
        ImageUrl: "https://source.unsplash.com/random/1",
      },
      {
        id: "song2",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        Duration: 605,
      },
      {
        id: "song3",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        Duration: 605,
      },
      {
        id: "song4",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        Duration: 605,
      },
      {
        id: "song5",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        Duration: 605,
      },
    ],
  },
  {
    id: "artist4",
    ImageUrl: "https://source.unsplash.com/random/19",
    ImageUrl2: "https://source.unsplash.com/random/20",
    Name: "Artist 4 Name",
    About: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged`,
    Followers: 500000,
    Type: OpenType.Artist,
    MonthlyListeners: 2450000,
    Songs: [
      {
        id: "song1",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
        Duration: 605,
        ImageUrl: "https://source.unsplash.com/random/1",
      },
      {
        id: "song2",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        Duration: 605,
      },
      {
        id: "song3",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        Duration: 605,
      },
      {
        id: "song4",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        Duration: 605,
      },
      {
        id: "song5",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        Duration: 605,
      },
    ],
  },
  {
    id: "artist5",
    ImageUrl: "https://source.unsplash.com/random/21",
    ImageUrl2: "https://source.unsplash.com/random/22",
    Name: "Artist 5 Name",
    About: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged`,
    Followers: 120000,
    Type: OpenType.Artist,
    MonthlyListeners: 5427480,
    Songs: [
      {
        id: "song1",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
        Duration: 605,
        ImageUrl: "https://source.unsplash.com/random/1",
      },
      {
        id: "song2",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        Duration: 605,
      },
      {
        id: "song3",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        Duration: 605,
      },
      {
        id: "song4",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        Duration: 605,
      },
      {
        id: "song5",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        Duration: 605,
      },
    ],
  },
  {
    id: "artist6",
    ImageUrl: "https://source.unsplash.com/random/21",
    ImageUrl2: "https://source.unsplash.com/random/22",
    Name: "Artist 6 Name",
    About: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged`,
    Followers: 120000,
    Type: OpenType.Artist,
    MonthlyListeners: 5427480,
    Songs: [
      {
        id: "song1",
        Title: "title of the song",
        Url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
        Duration: 605,
        ImageUrl: "https://source.unsplash.com/random/1",
      },
      {
        id: "song2",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        Duration: 605,
      },
      {
        id: "song3",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        Duration: 605,
      },
      {
        id: "song4",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        Duration: 605,
      },
      {
        id: "song5",
        Title: "title of the song",
        Url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        Duration: 605,
      },
    ],
  },
];
