// PRIVI INSURANCE sample data

//This will be replaced by firebase data

export interface PoolData {
  id: string;
  insurer_id: string;
  insurer_name: string;
  insurer_imageurl: string;
  apr: number;
  followers: number;
  returns: number;
  claiming_percentage: number;
  inscription_fee: number;
  subscription_fee: number;
  frequency: string;
  pod_id: string;
  pod_name: string;
  pod_imageurl: string;
  pod_trust_score: number;
  pod_endorsement_score: number;
  pod_coverage_rate: number;
  pod_followers: number;
  pod_insurers: number;
  insurance_depth: number;
  insured_amount: number;
  transactions: any[];
}

export const poolRows: PoolData[] = [
  {
    id: 'pool1id',
    insurer_id: 'insurer1id',
    insurer_name: 'Google',
    insurer_imageurl:
      'https://pbs.twimg.com/profile_images/988272404915875840/lE7ZkrO-_400x400.jpg',

    apr: 0.5,
    followers: 10,
    returns: 10,
    claiming_percentage: 0.1,
    inscription_fee: 1,
    subscription_fee: 1,
    frequency: 'Monthly',
    pod_id: 'pod1id',
    pod_name: 'UPC Master',
    pod_imageurl:
      'https://www.emagister.com/es/albums/9/2/1/5/5/xl_cropped_04cf6069afc83160b76598dbab74d6ac.png',
    pod_trust_score: 0.7,
    pod_endorsement_score: 0.5,
    pod_coverage_rate: 0.65,
    pod_followers: 75,
    pod_insurers: 20,
    insurance_depth: 10,
    insured_amount: 2,
    transactions: [
      {
        type: 'Insurance creation',
        amount: '300',
        token: 'DAI',
        from: 'Zurich',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
      {
        type: 'Insurance inscription',
        amount: '300',
        token: 'DAI',
        from: 'insurer name',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
      {
        type: 'Insurance subscription',
        amount: '300',
        token: 'DAI',
        from: 'Zurich',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
    ],
  },
  {
    id: 'pool2id',
    insurer_id: 'insurer2id',
    insurer_name: 'Facebook',
    insurer_imageurl:
      'https://brandemia.org/sites/default/files/inline/images/facebook_icono_despues2.jpg',
    apr: 0.1,
    followers: 10,
    returns: 10,
    claiming_percentage: 0.1,
    inscription_fee: 1,
    subscription_fee: 1,
    frequency: 'Weekly',
    pod_id: 'pod2id',
    pod_name: 'Save the Children campaign',
    pod_imageurl:
      'https://www.tucomarca.com/wordpress/segunda/wp-content/uploads/2017/11/savethechildren.jpg',
    pod_trust_score: 0.7,
    pod_endorsement_score: 0.5,
    pod_coverage_rate: 0.65,
    pod_followers: 75,
    pod_insurers: 20,
    insurance_depth: 10,
    insured_amount: 2,
    transactions: [
      {
        type: 'Insurance creation',
        amount: '300',
        token: 'DAI',
        from: 'Zurich',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
      {
        type: 'Insurance inscription',
        amount: '300',
        token: 'DAI',
        from: 'insurer name',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
      {
        type: 'Insurance subscription',
        amount: '300',
        token: 'DAI',
        from: 'Zurich',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
    ],
  },

  {
    id: 'pool3id',
    insurer_id: 'insurer3id',
    insurer_name: 'Nike',
    insurer_imageurl:
      'https://c.static-nike.com/a/images/w_1200,c_limit/bzl2wmsfh7kgdkufrrjq/seo-title.jpg',
    apr: 1,
    followers: 90,
    returns: 10,
    claiming_percentage: 0.1,
    inscription_fee: 1,
    subscription_fee: 1,
    frequency: 'Daily',
    pod_id: 'pod3id',
    pod_name: 'Research in Antartica',
    pod_imageurl:
      'https://dam.ngenespanol.com/wp-content/uploads/2020/02/antartida.jpg',
    pod_trust_score: 0.5,
    pod_endorsement_score: 0.65,
    pod_coverage_rate: 0.75,
    pod_followers: 80,
    pod_insurers: 10,
    insurance_depth: 20,
    insured_amount: 1,
    transactions: [
      {
        type: 'Insurance creation',
        amount: '300',
        token: 'DAI',
        from: 'Zurich',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
      {
        type: 'Insurance inscription',
        amount: '300',
        token: 'DAI',
        from: 'insurer name',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
      {
        type: 'Insurance subscription',
        amount: '300',
        token: 'DAI',
        from: 'Zurich',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
    ],
  },
  {
    id: 'pool4id',
    insurer_id: 'insurer4id',
    insurer_name: 'Zurich',
    insurer_imageurl:
      'https://www.lawebdeseguros.com/wp-content/uploads/2012/11/LOGO-ZURICH.jpg',
    apr: 0.1,
    followers: 10,
    returns: 10,
    claiming_percentage: 0.1,
    inscription_fee: 1,
    subscription_fee: 1,
    frequency: 'Monthly',
    pod_id: 'pod1id',
    pod_name: 'UPC Master',
    pod_imageurl:
      'https://www.emagister.com/es/albums/9/2/1/5/5/xl_cropped_04cf6069afc83160b76598dbab74d6ac.png',
    pod_trust_score: 0.7,
    pod_endorsement_score: 0.5,
    pod_coverage_rate: 0.65,
    pod_followers: 75,
    pod_insurers: 10,
    insurance_depth: 10,
    insured_amount: 10,
    transactions: [
      {
        type: 'Insurance creation',
        amount: '300',
        token: 'DAI',
        from: 'Zurich',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
      {
        type: 'Insurance inscription',
        amount: '300',
        token: 'DAI',
        from: 'insurer name',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
      {
        type: 'Insurance subscription',
        amount: '300',
        token: 'DAI',
        from: 'Zurich',
        to: 'pod name',
        date: '19/11/2020 13:00',
      },
    ],
  },
];

export interface InsurerData {
  id: string;
  insurer_name: string;
  insurer_imageurl: string;
  followers: number;
  insured_pods: number;
  investors: number;
}

export const insurerRows = [
  {
    id: 'insurer1id',
    insurer_name: 'Google',
    insurer_imageurl:
      'https://pbs.twimg.com/profile_images/988272404915875840/lE7ZkrO-_400x400.jpg',
    followers: 10,
    insured_pods: 10,
    investors: 20,
  },
  {
    id: 'insurer2id',
    insurer_name: 'Facebook',
    insurer_imageurl:
      'https://brandemia.org/sites/default/files/inline/images/facebook_icono_despues2.jpg',
    followers: 1,
    insured_pods: 10,
    investors: 65,
  },
  {
    id: 'insurer3id',
    insurer_name: 'Nike',
    insurer_imageurl:
      'https://c.static-nike.com/a/images/w_1200,c_limit/bzl2wmsfh7kgdkufrrjq/seo-title.jpg',
    followers: 10,
    insured_pods: 90,
    investors: 75,
  },
  {
    id: 'insurer4id',
    insurer_name: 'Zurich',
    insurer_imageurl:
      'https://www.lawebdeseguros.com/wp-content/uploads/2012/11/LOGO-ZURICH.jpg',
    followers: 10,
    insured_pods: 65,
    investors: 75,
  },
];
