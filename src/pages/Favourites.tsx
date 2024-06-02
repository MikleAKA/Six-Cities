import {OfferType} from '../types/offer.tsx';
import Header from './Header.tsx';
import {useAppDispatch, useAppSelector} from '../hooks';
import {useEffect} from 'react';
import Spinner from './Loading-Screen.tsx';
import {fetchFavourites} from '../api/api-action.ts';
import {constCities, filters} from '../consts/cities.tsx';
import FavouriteCardList from '../components/favourite-list.tsx';

export default function Favourites() {
  const dispatch = useAppDispatch();
  const favourites = useAppSelector((state) => state.favourites.favourites);
  const favouritesCounter = useAppSelector((state) => state.favourites.favouritesCounter);
  useEffect(() => {
    dispatch(fetchFavourites());
  }, [dispatch, favouritesCounter]);
  if (!favourites) {
    return <Spinner/>;
  }
  const favouriteCities: { city: string; offers: OfferType[] }[] = [];
  constCities.forEach((city) => favouriteCities.push({
    city: city,
    offers: favourites.filter((f) => f.city.name === city)
  }));
  const favoritesMap = favouriteCities.filter((city) => city.offers.length > 0);
  if (favoritesMap.length === 0) {
    return (
      <div className="page">
        <Header/>
        <main className="page__main page__main--favorites page__main--favorites-empty">
          <div className="page__favorites-container container">
            <section className="favorites favorites--empty">
              <h1 className="visually-hidden">Favorites (empty)</h1>
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">
                  Save properties to narrow down search or plan your future trips.
                </p>
              </div>
            </section>
          </div>
        </main>
        <footer className="footer">
          <a className="footer__logo-link" href="#">
            <img
              className="footer__logo"
              src="img/logo.svg"
              alt="6 cities logo"
              width={64}
              height={33}
            />
          </a>
        </footer>
      </div>
    );
  }
  return (
    <div className="page">
      <Header/>
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              {(favoritesMap).map((item) => (
                <li className="favorites__locations-items" key={item.city}>
                  <div className="favorites__locations locations locations--current">
                    <div className="locations__item">
                      <a className="locations__item-link" href="#">
                        <span>{item.city}</span>
                      </a>
                    </div>
                  </div>
                  <div className="favorites__places">
                    <FavouriteCardList favouriteCards={item.offers.map((item_) => ({...item_, image: item_.previewImage, roomName: item_.title, roomType: item_.type}))} sortType={filters.TOP_RATED}/>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <footer className="footer container">
        <a className="footer__logo-link" href="#">
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width="64"
            height="33"
          />
        </a>
      </footer>
    </div>
  );
}
