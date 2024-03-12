import Image from 'next/image';
import logo from '@/public/lc_logo.gif';

const Logo = () => {
  return <Image src={logo} width={30} height={30} alt='Logicola' />;
};

export default Logo;
