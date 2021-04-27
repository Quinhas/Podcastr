import {format, parseISO} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {GetStaticPaths, GetStaticProps} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../../contexts/PlayerContext';
import {api} from '../../services/api';
import {convertDurationToTimeString} from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';

type EpisodeProps = {
	id: string;
	title: string;
	thumbnail: string;
	members: string;
	description: string;
	duration: number;
	durationAsString: string;
	url: string;
	publishedAt: string;
};

type Props = {
	episode: EpisodeProps;
};

export default function Episode({episode}: Props) {
	const { play } = usePlayer()
	return (
		<div className={styles.episode}>
			<Head>
				<title>{episode.title} | Podcastr</title>
			</Head>
			<div className={styles.thumbnailContainer}>
        <Link href={'/'}>
          <button type="button">
            <img src='/arrow-left.svg' alt='Voltar' />
          </button>
        </Link>
				<Image width={640} height={360} src={episode.thumbnail} objectFit='cover' />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio"/>
        </button>
			</div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}}/>
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async (ctx) => {
	const {slug} = ctx.params;
	const {data} = await api.get(`episodes/${slug}`);

	const episode = {
		id: data.id,
		title: data.title,
		thumbnail: data.thumbnail,
		members: data.members,
		publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
		duration: Number(data.file.duration),
		durationAsString: convertDurationToTimeString(Number(data.file.duration)),
		description: data.description,
		url: data.file.url,
	};

	return {
		props: {
			episode,
		},
		revalidate: 60 * 60 * 24,
	};
};
