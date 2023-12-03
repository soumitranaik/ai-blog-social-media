
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Main } from './pages/main';
import { Login } from './pages/login';
import Templates from './components/Templates';
import Navbar from './components/Navbar';
import Blog from './pages/blog';
import Footer from './components/Footer';
import Blogs from './pages/blogs';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/templates" element={ <Templates />} />
          <Route path="/" element={ <Main />} />
          <Route path='/login' element={<Login />} />
          <Route path='blogs/:blogurl' element={<Blog />} />
          <Route path='blog' element={<Blogs />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
