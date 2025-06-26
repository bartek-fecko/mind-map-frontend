import Link from 'next/link';
import Image from 'next/image';
import { Clock, Edit, FolderKanban } from 'lucide-react';
import { getTimeAgo } from '@/app/utils/helpers';
import ShareBoardButton from '../ShareBoardButton/ShareBoardButton';
import DeleteBoardButton from '../DeleteBoardButton/DeleteBoardButton';

interface BoardCardProps {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  users: Array<{
    id: string;
    email: string;
    image: string | null;
  }>;
}

export default function BoardCard({ id, title, createdAt, updatedAt, imageUrl, users }: BoardCardProps) {
  return (
    <div className="card w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-[260px] flex flex-col justify-between">
      <Link href={`/boards/${id}`} className="block">
        <div className="relative w-full h-28 bg-gray-100 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Obrazek tablicy ${title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <FolderKanban size={36} />
              <span className="text-xs mt-1">Brak obrazka</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-base font-semibold text-label-base line-clamp-2">{title}</h3>
        </div>
      </Link>

      <div className="px-3 pb-3 flex flex-col gap-2">
        <div className="flex space-x-4 text-gray-500 text-sm">
          <div className="flex items-center space-x-1 text-text-secondary">
            <Clock size={16} />
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1 text-text-secondary">
            <Edit size={16} />
            <span>{getTimeAgo(updatedAt)}</span>
          </div>
        </div>

        <div className="flex items-center mt-auto">
          {users.map(
            (user, index) =>
              user.image && (
                <Image
                  key={user.id}
                  src={user.image}
                  alt={user.email}
                  width={28}
                  height={28}
                  className={`rounded-full border-2 border-white ${index !== 0 ? '-ml-2' : ''}`}
                />
              ),
          )}
          <div className="ml-auto flex">
            <DeleteBoardButton id={id} title={title} />
            <ShareBoardButton id={id} title={title} />
          </div>
        </div>
      </div>
    </div>
  );
}
