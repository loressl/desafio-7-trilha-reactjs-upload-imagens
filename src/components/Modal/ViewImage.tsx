import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {

  return(
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
      <ModalOverlay/>
      <ModalContent
        maxW={['300px','500px','900px']}
        maxH={['350px', '450px', '600px']}
        w='auto'
        h='auto'
      >
        <ModalBody p="0">
          <Image 
            src={imgUrl}
            maxW={['300px','500px','900px']}
            maxH={['350px', '450px', '600px']}
          />
        </ModalBody>
        <ModalFooter 
          bg='pGray.800' 
          h='2rem' 
          borderBottomRadius='6px'
        >
          <Link href={imgUrl} isExternal fontSize="14px" mr='auto' color='pGray.50'> 
            Abrir original
          </Link>
        </ModalFooter>

      </ModalContent>
    </Modal>
  )
}
