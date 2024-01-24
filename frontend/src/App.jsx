import './App.css'
import Home from './pages/Home'
import 'tailwindcss/tailwind.css';


function App() {

  return (
    <div className='flex flex-col items-center bg-slate-900 h-full'>
      <h1 className='text-white text-4xl py-8'>- Gästebuch -</h1>
      <Home/>
    </div>
  )
}

export default App
