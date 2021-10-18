import React, { useEffect, useState } from "react";
import "./NewsTutorials.css";
import ArticleItem from "./components/ArticleItem";
import { Articles } from "./articlesData";
import {
  communitiesTutorials,
  creditPoolsTutorials,
  podsTutorials,
} from "shared/ui-kit/Page-components/Tutorials/Tutorials";

export default function NewsTutorials() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    //TODO: load real data
    let news = [] as any;
    news = [...Articles];

    //load tutorials
    news.push(communitiesTutorials);
    news.push(podsTutorials);
    news.push(creditPoolsTutorials);

    news.sort((a, b) => b.Date - a.Date);

    setNews(news);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="growth-news">
      <h3>Latest news and tutorials</h3>
      <div className="posts">
        {news && news.length > 0 ? (
          news.map((n, index) => {
            return <ArticleItem item={n} key={`new-${index}`} />;
          })
        ) : (
          <p>No news</p>
        )}
      </div>
    </div>
  );
}
