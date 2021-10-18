import React, { useEffect, useState } from 'react';
import './Vote.css';
import IssueItem from './components/IssueItem';
import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import URL from "shared/functions/getURL";

export default function Vote() {
  const [issues, setIssuses] = useState<any[]>([]);

  const loadData = () => {
    trackPromise(
      axios
        .get(`${URL()}/voting/getPredictions`)
        .then((response) => {
          const resp = response.data;
          if (resp.success) {
            const data = resp.data;
            setIssuses(data);
          }
        })
    );
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="growth-vote">
      <h3>Issues</h3>
      <div className="issues">
        {issues && issues.length > 0 ? (
          issues.map((issue, index) => {
            return <IssueItem handleRefresh={loadData} issue={issue} key={`issue-${index}`} />;
          })
        ) : (
            <p>No issues</p>
          )}
      </div>
    </div>
  );
}
