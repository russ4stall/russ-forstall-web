import * as ReactDOMClient from 'react-dom/client'; 
import Matrix from './matrix';


const root = ReactDOMClient.createRoot(document.getElementById('matrix-app')!);
root.render(<Matrix />);