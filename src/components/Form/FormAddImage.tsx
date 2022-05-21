import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type FormData = {
  title: string
  description: string
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const regexImage= /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#](?:jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/g

  const formValidations = {
    image: {
      required: {
        value: true,
        message: 'Arquivo obrigatório'
      },
      validate:{
        lessThan10MB: file => file[0].size < 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: file => regexImage.test(file[0].type) || 'Somente são aceitos arquivos PNG, JPEG e GIF'
      }
    },
    title: {
      required: {
        value: true,
        message: 'Título obrigatório'
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres'
      },
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres'
      },
    },
    description: {
      required: {
        value: true,
        message: 'Descrição obrigatória'
      },
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres'
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
     async (data: FormData) => {
       await api.post('/api/images', {
         title: data.title,
         description: data.description,
         url: imageUrl
       })
     },
    {
      onSuccess: () =>{
        queryClient.invalidateQueries('images')
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if(!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
        })
        return
      }
      await mutation.mutateAsync({title: String(data.title), description: String(data.description)})

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
      })
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
      })
    } finally {
      reset()
      setImageUrl('')
      setLocalImageUrl('')
      closeModal()
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name='image'
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          name='title'
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name='description'
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
