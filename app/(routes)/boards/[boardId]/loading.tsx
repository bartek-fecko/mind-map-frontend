import MainHeader from '@/app/components/Headers/MainHeader/MainHeader';
import Loader from '@/app/components/Loader/Loader';

export default function Loading() {
  return (
    <div className='w-full'>
      <MainHeader />
      <Loader />
    </div>
  );
}
