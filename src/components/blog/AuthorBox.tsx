import { Linkedin, User } from 'lucide-react';
import { authorProfileUrl, type AuthorProfile } from '@/lib/authors';

interface AuthorBoxProps {
  author: (AuthorProfile & { avatar_url?: string | null }) | null | undefined;
}

/** "Sobre a autora" no fim do conteúdo (EEAT): quem escreveu e onde verificar. */
export default function AuthorBox({ author }: AuthorBoxProps) {
  if (!author?.name) return null;
  const profileUrl = authorProfileUrl(author);

  return (
    <aside aria-label="Sobre a autora" className="mt-10 flex flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:p-6">
      {author.avatar_url ? (
        <img src={author.avatar_url} alt={author.name} className="h-14 w-14 shrink-0 rounded-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f8f9fa] text-[#aaa]">
          <User size={22} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#aaa]">Sobre a autora</p>
        <p className="text-base font-black text-[#1a1a1a]">{author.name}</p>
        {author.job_title && <p className="text-xs font-semibold text-[#555]">{author.job_title}</p>}
        {author.bio && <p className="mt-2 text-sm leading-relaxed text-[#555]">{author.bio}</p>}
        {profileUrl && (
          <a
            href={profileUrl}
            target="_blank"
            rel="author noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-[#0A66C2] hover:underline"
          >
            <Linkedin size={14} /> Perfil no LinkedIn
          </a>
        )}
      </div>
    </aside>
  );
}
