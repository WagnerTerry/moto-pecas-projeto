import { ToastContainer, toast } from 'react-toastify';
import { routes as Routes } from './routes';

import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <div>
      <Routes />
      <ToastContainer />
    </div>
  )
}

export default App
