type Weather = {
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
};

type NewsArticle = {
  title: string;
  url: string;
  preview: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
};

type Scheme = {
  name: string;
  url: string;
  preview: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
};
