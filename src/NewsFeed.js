import React, {useState, useEffect} from 'react'
/*
  * Request Top Headline from https://newsapi.org/
  * Show Loading message while fetching
  * Handle Error
  * Complete functionality of 'Load More' & 'Refresh' button
*/

const defaultNews = {
  status :"ok",
  totalResults : 0,
  articles : []
}

const endpoint = "https://newsapi.org/v2/top-headlines?country=us&apiKey=4ed51672fb6e4b0cb518a3fbb6943443"

export default function NewsFeed() {
  
  const [news, setNews] = useState(defaultNews) 
  const [page , setPage] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [isError, setError] = useState(false)
  const [isRefresh, setRefresh] = useState(false)

  const handleRefresh = () =>{
    setNews(defaultNews)
    setPage(1)
    setLoading(false)
    setRefresh(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const response = await fetch(`${endpoint}&page=${page}`)
        const result = await response.json()
  
        setNews (current => {
          return ({
            ...result,
            articles : [...current.articles, ... result.articles],
            totalResults : result.totalResults,
            status : result.status
          })
        })
        if (result.status !== "ok"){
          throw new Error('error')
        }
      } catch (error) {
        setError(true)
      }
      setLoading(false)
    }
    fetchData()
  }, [page, isRefresh])

  return (
    <div>
      <h3>Top News Headline</h3>
      {isLoading && <p>Loading..</p>}
      {isError && <p>Maaf bang ada gangguan</p>}
      <ol>
        {news.articles.map((item, index) => (
          <li key={index}> {item.title} </li>
        ))}
      </ol>
      {
        news.articles.length < parseInt(news.totalResults) ? (
          <button
            disabled={isLoading}
            onClick= { () => setPage(c => c+1)}
          >Load More</button>
        ) : null
      }
      <button onClick={handleRefresh} disabled={isLoading}>Refresh</button>
    </div>
  )
}