import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { DiscoveredUsers } from '@/features/profile/components/DiscoveredUsers';

export default function Page() {
  return (
    <div>
      <Header>
        <BackButton />
        <h3 className='text-lg font-semibold'>Follow</h3>
      </Header>

      <DiscoveredUsers />
    </div>
  );
}
