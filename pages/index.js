import Logo from '/public/myClubs_Logo.webp';
import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const pageStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  .info {
    width: 85vw;
    max-width: 800px;
    h1 {
      font-style: italic;
      font-size: 38px;
      font-weight: 900;
      letter-spacing: 1px;
      margin: 2rem 0;
    }
  }
  .filters {
    button {
      border: 1px solid #bdbcbf;
      border-radius: 50px;
      background-color: transparent;
      padding: 0.25rem 0.5rem;
      margin-right: 0.5rem;
      margin-top: 0.5rem;
    }
    .active {
      border: 1px solid #36343e;
    }
  }

  .days {
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    margin-bottom: 50px;
    button {
      text-align: center;
      outline: 1px solid #bdbcbf;
      border-radius: 3px;
      border: none;
      background-color: transparent;
      margin: 0.25rem;
      padding: 0.8rem 1.2rem;
      :hover {
        outline: 2px solid #22202b;
      }
      .name {
        font-size: 12px;
        margin: 0;
      }
      .number {
        font-weight: bold;
        font-size: 20px;
        margin: 0;
      }
    }
    .active {
      background-color: #22202b;
      outline: 2px solid #22202b;
      color: #fff;
    }
  }

  .activity {
    margin: 20px 0;
    box-shadow: rgb(0 0 0 / 10%) 0 0 20px 0;
    border-radius: 3px;
    padding: 30px;
    min-height: 300px;
    h2 {
      margin: 0;
    }
    span {
      border: 1px solid #bdbcbf;
      border-radius: 50px;
      background-color: transparent;
      padding: 0 0.4rem 0.2rem;
      margin-right: 0.5rem;
    }
    button {
      transition: 300ms ease-in-out;
      border-radius: 3px;
      border: 1px solid #fe2c2a;
      background-color: #fe2c2a;
      color: #f9f9f9;
      padding: 0 2em;
      font-size: 11px;
      letter-spacing: 1px;
      margin-right: 10px;
      margin-top: 10px;
      :hover {
        border: 1px solid #fe2c2a;
        background-color: transparent;
        color: #fe2c2a;
      }
    }
    .more {
      background-color: #36343e;
      border: 1px solid #36343e;
      :hover {
        border: 1px solid #36343e;
        background-color: transparent;
        color: #36343e;
      }
    }
    .invisible {
      height: 0;
      width: 0;
      overflow: hidden;
    }

    .moreInfo {
      line-height: 1.5;
      button {
        background-color: transparent;
        color: #36343e;
        border: none;
        transition: none;
        padding: 5px;
        :hover {
          outline: 1px solid #36343e;
        }
      }
    }
  }
`;

export default function Home() {
  const [allWorkouts, setAllWorkouts] = useState([]);

  // filter the workouts by country or participationMode
  const [countryFilter, setCountryFilter] = useState();
  const [modeFilter, setModeFilter] = useState();

  // this is for the styling
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedTime, setSelectedTime] = useState(13);
  const [moreInfoVisible, setMoreInfoVisible] = useState('invisible');

  const router = useRouter();

  // the workouts are always filtered by the selected day
  const workoutsSortedByDay = allWorkouts.filter((workout) =>
    new Date(workout._source.activityDate.start.iso)
      .toLocaleDateString('en-DE', {
        day: 'numeric',
      })
      .includes(selectedTime),
  );

  // use the country and/or participationMode filters or only the weekday filter
  // this is the info i will map over to display the workouts
  const filteredWorkouts =
    countryFilter && modeFilter
      ? workoutsSortedByDay.filter(
          (workout) =>
            countryFilter.includes(workout) && modeFilter.includes(workout),
        )
      : countryFilter && !modeFilter
      ? workoutsSortedByDay.filter((workout) => countryFilter.includes(workout))
      : modeFilter && !countryFilter
      ? workoutsSortedByDay.filter((workout) => modeFilter.includes(workout))
      : workoutsSortedByDay;

  // fetch the data for the sports activities on page load
  useEffect(() => {
    const getWorkouts = async () => {
      const response = await fetch('/api/workouts');
      const data = await response.json();

      if ('errors' in data) {
        console.log(data.errors);
        return;
      }
      setAllWorkouts([...data.body.hits.hits]);
    };
    getWorkouts().catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Head>
        <title>myClubs workouts</title>
        <meta name="description" content="Find your perfect next workout" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={pageStyles}>
        {/* <Image src={Logo} /> */}
        <div className="info">
          <h1>FIND YOUR WORKOUT</h1>
          <div className="filters">
            <button
              onClick={() => {
                setCountryFilter('');
                setModeFilter('');
                setSelectedCountry('');
                setSelectedMode('');
              }}
            >
              Clear filters
            </button>
            <button
              className={selectedCountry === 'CH' ? 'active' : 'inactive'}
              onClick={() => {
                setSelectedCountry(selectedCountry === 'CH' ? 'AT' : 'CH');
                setCountryFilter(
                  countryFilter === 'CH'
                    ? allWorkouts
                    : allWorkouts.filter(
                        (workout) => workout._source.country === 'CH',
                      ),
                );
              }}
            >
              CH
            </button>
            <button
              className={selectedCountry === 'AT' ? 'active' : 'inactive'}
              onClick={() => {
                setSelectedCountry(selectedCountry === 'AT' ? 'CH' : 'AT');
                setCountryFilter(
                  countryFilter === 'AT'
                    ? allWorkouts
                    : allWorkouts.filter(
                        (workout) => workout._source.country === 'AT',
                      ),
                );
              }}
            >
              AT
            </button>
            <button
              className={selectedMode === 'indoor' ? 'active' : 'inactive'}
              onClick={() => {
                setSelectedMode(selectedMode === 'indoor' ? '' : 'indoor');
                setModeFilter(
                  modeFilter.includes('indoor')
                    ? allWorkouts
                    : allWorkouts.filter((workout) =>
                        workout._source.participationModes.includes('indoor'),
                      ),
                );
              }}
            >
              Indoor
            </button>
            <button
              className={selectedMode === 'outdoor' ? 'active' : 'inactive'}
              onClick={() => {
                setSelectedMode(selectedMode === 'outdoor' ? '' : 'outdoor');
                setModeFilter(
                  modeFilter.includes('outdoor')
                    ? allWorkouts
                    : allWorkouts.filter((workout) =>
                        workout._source.participationModes.includes('outdoor'),
                      ),
                );
              }}
            >
              Outdoor
            </button>
            <button
              className={selectedMode === 'online' ? 'active' : 'inactive'}
              onClick={() => {
                setSelectedMode(selectedMode === 'online' ? '' : 'online');
                setModeFilter(
                  modeFilter.includes('videostream')
                    ? allWorkouts
                    : allWorkouts.filter((workout) =>
                        workout._source.participationModes.includes(
                          'videostream',
                        ),
                      ),
                );
              }}
            >
              Online
            </button>
          </div>
          <div className="days">
            <button
              className={selectedTime === 13 ? 'active' : 'inactive'}
              onClick={() => {
                setSelectedTime(13);
              }}
            >
              <p className="name">Thu</p>
              <p className="number">13</p>
            </button>
            <button
              className={selectedTime === 14 ? 'active' : 'inactive'}
              onClick={() => {
                setSelectedTime(14);
              }}
            >
              <p className="name">Fri</p>
              <p className="number">14</p>
            </button>
            <button
              className={selectedTime === 15 ? 'active' : 'inactive'}
              onClick={() => {
                setSelectedTime(15);
              }}
            >
              <p className="name">Sat</p>
              <p className="number">15</p>
            </button>
            <button
              className={selectedTime === 16 ? 'active' : 'inactive'}
              onClick={() => {
                setSelectedTime(16);
              }}
            >
              <p className="name">Sun</p>
              <p className="number">16</p>
            </button>
            <button
              className={selectedTime === 17 ? 'active' : 'inactive'}
              onClick={() => {
                setSelectedTime(17);
              }}
            >
              <p className="name">Mon</p>
              <p className="number">17</p>
            </button>
          </div>
          {filteredWorkouts &&
            filteredWorkouts.map((workout) => {
              return (
                <div key={`workout-${workout._source.id}`} className="activity">
                  <div
                    className={
                      moreInfoVisible.includes(workout._source.id)
                        ? 'invisible'
                        : 'visible'
                    }
                  >
                    <p>{workout._source.partner.name}</p>
                    <h2>{workout._source.name}</h2>

                    <p>
                      {`${new Date(
                        workout._source.activityDate.start.iso,
                      ).toLocaleDateString('en-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}, ${new Date(
                        workout._source.activityDate.start.iso,
                      ).toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}-${new Date(
                        workout._source.activityDate.end.iso,
                      ).toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`}
                    </p>
                    <p>
                      {workout._source.categories.map((category) => {
                        return (
                          <span
                            key={`workout-${workout._source.id}-category-${category}`}
                          >
                            {category.slice(3)}{' '}
                          </span>
                        );
                      })}
                    </p>
                    <p>
                      {`${workout._source.city}, ${workout._source.country}`}
                      <br />
                      {`${workout._source.zipCode}, ${workout._source.street}`}
                    </p>
                    <button onClick={() => router.push('/bookingConfirmation')}>
                      <h3>BOOK NOW</h3>
                    </button>
                    <button
                      className="more"
                      onClick={() =>
                        setMoreInfoVisible(`${workout._source.id}-visible`)
                      }
                    >
                      <h3>MORE INFO</h3>
                    </button>
                  </div>
                  <div
                    className={
                      moreInfoVisible.includes(workout._source.id)
                        ? 'visible moreInfo'
                        : 'invisible'
                    }
                  >
                    <button
                      onClick={() => setMoreInfoVisible('invisible')}
                      aria-label="close info"
                    >
                      X
                    </button>
                    <p>{workout._source.description}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

// cream: #fff0e1
// #f9f9f9
// red: #fe2c2a
// dark: #22202b
// #36343e
