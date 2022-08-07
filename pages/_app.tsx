import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'jotai';
import { QueryClientProvider, QueryClient,  } from '@tanstack/react-query'
import { ReactQueryDevtools} from '@tanstack/react-query-devtools';
import Nav from '../components/nav';

function MyApp({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient();

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

export default MyApp
