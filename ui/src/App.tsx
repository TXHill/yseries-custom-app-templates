import React, { useEffect, useState } from "react";
import { fetchNui } from "./utils/fetchNui";
import { useNuiEvent } from "./utils/useNuiEvent";
import { format } from "date-fns";
import "./App.css";

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  image?: string;
}

interface UserData {
  isReporter: boolean;
  playerName: string;
  jobGrade: number;
}

const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'create' | 'article'>('list');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    // Fetch initial data
    fetchNui<Article[]>("getArticles", {}).then(setArticles);
    fetchNui<UserData>("getUserData", {}).then(setUserData);
  }, []);

  // Listen for new articles
  useNuiEvent<Article>("newArticle", (article) => {
    setArticles(prev => [article, ...prev]);
  });

  const handleCreateArticle = async (articleData: Omit<Article, 'id' | 'date' | 'author'>) => {
    const response = await fetchNui<Article>("createArticle", articleData);
    if (response) {
      setArticles(prev => [response, ...prev]);
      setActiveView('list');
    }
  };

  return (
    <div className="app" data-theme="dark">
      <div className="app-wrapper">
        <header className="header">
          <h1 className="title">{Config.Header.text}</h1>
          {userData?.isReporter && (
            <button 
              className="create-button"
              onClick={() => setActiveView('create')}
            >
              Create Article
            </button>
          )}
        </header>

        {activeView === 'list' && (
          <div className="articles-list">
            {articles.map(article => (
              <div 
                key={article.id} 
                className="article-card"
                onClick={() => {
                  setSelectedArticle(article);
                  setActiveView('article');
                }}
              >
                {article.image && (
                  <img src={article.image} alt={article.title} className="article-image" />
                )}
                <h2 className="article-title">{article.title}</h2>
                <div className="article-meta">
                  <span>{article.author}</span>
                  <span>{format(new Date(article.date), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'create' && userData?.isReporter && (
          <CreateArticleForm onSubmit={handleCreateArticle} onCancel={() => setActiveView('list')} />
        )}

        {activeView === 'article' && selectedArticle && (
          <ArticleView 
            article={selectedArticle} 
            onBack={() => {
              setActiveView('list');
              setSelectedArticle(null);
            }}
            canEdit={userData?.isReporter && userData.jobGrade >= Config.Permissions.edit}
          />
        )}
      </div>
    </div>
  );
};

interface CreateArticleFormProps {
  onSubmit: (data: Omit<Article, 'id' | 'date' | 'author'>) => void;
  onCancel: () => void;
}

const CreateArticleForm: React.FC<CreateArticleFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: ''
  });

  return (
    <form 
      className="create-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <input
        type="text"
        placeholder="Article Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
      />
      <textarea
        placeholder="Article Content"
        value={formData.content}
        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
      />
      <input
        type="url"
        placeholder="Image URL (optional)"
        value={formData.image}
        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
      />
      <div className="form-buttons">
        <button type="submit">Publish</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  canEdit: boolean;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack, canEdit }) => {
  return (
    <div className="article-view">
      <button className="back-button" onClick={onBack}>Back</button>
      {article.image && (
        <img src={article.image} alt={article.title} className="article-full-image" />
      )}
      <h1>{article.title}</h1>
      <div className="article-meta">
        <span>{article.author}</span>
        <span>{format(new Date(article.date), 'MMM dd, yyyy')}</span>
      </div>
      <div className="article-content">{article.content}</div>
      {canEdit && (
        <button className="edit-button">Edit Article</button>
      )}
    </div>
  );
};

export default App;