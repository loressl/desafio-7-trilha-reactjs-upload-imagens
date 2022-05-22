import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Image {
  title: string
  description: string
  url: string
  ts: number
  id: string
}

type GetListImageResponse = {
  data: Image[]
  after: string
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({pageParam=null}):Promise<GetListImageResponse> => {
      const { data } = await api.get('/api/images', {
        params: {
          after: pageParam
        }
      })
      return data
    },{
      getNextPageParam: last => last?.after || null
    }
  );

  const formattedData = useMemo(() => data?.pages.flatMap(item => item.data.flat()), [data]);

  if (isLoading) {
    return <Loading />
  }

  if(isError) {
    return <Error />
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && 
          <Button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
            { isFetchingNextPage ? 'Carregando..':'Carregar mais'}
          </Button>
        }
      </Box>
    </>
  );
}
