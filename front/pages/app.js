// import 'bulma/css/bulma.css'
import App, { Container } from "next/app";

export default function MyApp({ Component, pageProps }) {
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
    
  
  }