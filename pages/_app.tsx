import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider, atom } from 'jotai';
import { QueryClientProvider, QueryClient,  } from '@tanstack/react-query'
import { ReactQueryDevtools} from '@tanstack/react-query-devtools';
import Nav from '../components/nav';

function MyApp({ Component, pageProps, ...appProps }: AppProps) {

  
  const queryClient = new QueryClient();

  if(['/login', '/update-password'].includes(appProps.router.pathname)){
    return (
      <Provider>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <ReactQueryDevtools />
        </QueryClientProvider>
      </Provider>
      )
  } else {
    return (
      <Provider>
        <Nav />
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <ReactQueryDevtools />
        </QueryClientProvider>
      </Provider>
      )
  }
}

export default MyApp
