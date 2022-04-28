import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Model from '../public/lady-blonde.webp';
import Logo from '../public/myClubs_Logo.webp';

const pageStyles = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8vh 4vw;
  z-index: 0;
  .logo {
    width: 35vw;
    Image {
      width: 100%;
    }
  }
  h1 {
    text-align: center;
    margin: 12vh 0 9vh;
  }
  p {
    text-align: justify;
    max-width: 80vw;
  }
  span {
    font-style: italic;
  }
  .model {
    position: absolute;
    top: 40vh;
    right: 3vw;
    width: 60vw;
    opacity: 0.5;
    z-index: -1;
    Image {
      height: 100%;
    }
    @media screen and (min-width: 800px) and (max-height: 900px) {
      width: 400px;
      top: 16vh;
      right: 3vw;
    }
    @media screen and (max-width: 500px) {
      top: 60vh;
    }
  }
`;

export default function BookingConfirmation() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>myClubs booking confirmation</title>
        <meta
          name="description"
          content="Thank you for booking your next workout with myClubs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={pageStyles}>
        <div className="logo">
          <Link href="/">
            <a>
              <Image src={Logo} />
            </a>
          </Link>
        </div>
        <h1>Thank you for booking your workout with myClubs</h1>
        <p>
          You booked <span>{router.query.name}</span> with{' '}
          {router.query.partner}. Your class starts at{' '}
          {new Date(router.query.time).toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          on{' '}
          {new Date(router.query.time).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
          })}
          .
        </p>
        <div className="model">
          <Image src={Model} />{' '}
        </div>
      </div>
    </div>
  );
}
