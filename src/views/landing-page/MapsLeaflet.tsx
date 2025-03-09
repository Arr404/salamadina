import React, { useEffect, useRef, useState } from 'react'

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { motion, useInView } from "framer-motion";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
// eslint-disable-next-line import/order
import Link from 'next/link'

import Button from '@mui/material/Button'

import Chip from '@mui/material/Chip'

import Typography from '@mui/material/Typography'

import dataJson from '@views/landing-page/dataJson'

interface ILocation {
  number: number;
  name: string;
  address: string;
  phone: string | null;
  lat: number | null;
  long: number | null;
}

const MapsLeaflet = () => {
  const [allUserLocation, setAllUserLocation] = useState<ILocation[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<ILocation | null>(null);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(mapContainerRef, { amount: 0.3 }); // Detect when map is in view

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      if (isInView) {
        map.setView([-7.309103, 112.773148], 3, { animate: true }); // Start at zoom 3
        const zoomLevels = [4, 5, 6, 7, 8, 9, 10];

        zoomLevels.forEach((zoom, index) => {
          setTimeout(() => {
            map.setView([-7.309103, 112.773148], zoom, { animate: true });
          }, 100 * (index + 1)); // 500ms interval per step
        });
      } else {
        map.setView([-7.309103, 112.773148], 2, { animate: true }); // Zoom out when not in view
      }
    }
  }, [isInView]);

  useEffect(() => {
    // Manually setting JSON data instead of API call
    const jsonData: ILocation[] = dataJson;

    setAllUserLocation(jsonData);
    setIsLoading(false);
  }, []);

  const handleMarkerClick = (user: ILocation) => {
    setSelectedUser(user);
  };

  const handleGoBack = () => {
    setSelectedUser(null);
  };

  return (
    <div className="container-fluid mx-auto">

      <div className="md:pl-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className='flex flex-col gap-y-4 col-span-1 md:col-span-2 xl:col-span-4 items-center '>
          <Chip size='small' className="text-white bg-[#811745]" variant='tonal' color='primary' label='Agents' />
          <div className='flex flex-col items-center gap-y-1 justify-center flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <Typography variant='h4' className='text-center text-[#811745]'>
                <span className='text-bold  relative z-[1] font-extrabold'>
                  All Agent

                </span>{' '}
                In Indonesia
              </Typography>
            </div>
            <Typography className='text-center text-[#811745]'>
              Find one near you
            </Typography>
          </div>
        </div>
        <motion.div
          ref={mapContainerRef}
          initial={{ opacity: 1, y: 0 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="map-wrapper col-span-1 md:col-span-2 xl:col-span-3"
        >
          <MapContainer
            ref={mapRef}
            center={[-7.309103, 112.773148]}
            zoom={2}

            style={{ height: "500px" }}
            className="leaflet-map"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution={'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'}
              url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhlbWVzYnJhbmQiLCJhIjoiY2xmbmc3bTV4MGw1ejNzbnJqOWpubzhnciJ9.DNkdZVKLnQ6I9NOz7EED-w"
              id="mapbox/streets-v11"
            />
            {!isLoading && allUserLocation?.map((user: ILocation, index: number) =>
              user.lat !== null && user.long !== null ? (
                <Marker
                  key={index}
                  position={[user.lat, user.long]}
                  eventHandlers={{
                    click: () => handleMarkerClick(user)
                  }}
                >
                  <Popup>
                    <div className="text-[#811745]">
                      <b>{user.name}</b>
                      <br />
                      {user.address}
                    </div>
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </motion.div>

        {selectedUser ? (
          <div className="text-[#811745] card shadow-lg rounded-lg overflow-hidden min-w-[200px] max-h-[300px]">
            <div className="card-body p-5">
              <Button
                variant="text"
                startIcon={<i className="tabler-pointer-cancel text-xl" />}
                className="whitespace-nowrap absolute"
                target="_self"
                onClick={handleGoBack}
                href={""}
              />

              <div
                className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-[#811745] dark:bg-zink-600">
                                        <span className="text-xl font-bold text-white ">
                                            {selectedUser.name
                                              .split(' ')
                                              .map((word) => word.charAt(0))
                                              .join('')}
                                        </span>
              </div>
              <div className="mt-4 text-center">
                <h5 className="mb-1 text-xl font-semibold ">
                  {selectedUser.name}
                </h5>
                <p className="text-slate-500 dark:text-zink-300">
                  {selectedUser.address}
                </p>
              </div>
              <div className="mt-4 flex justify-center gap-3">
                <Button
                  component={Link}
                  variant="contained"
                  href={`tel:${selectedUser.phone}`}
                  startIcon={<i className="tabler-phone-call text-xl" />}
                  className="whitespace-nowrap"
                  target="_blank"
                >
                  Call
                </Button>

              </div>
            </div>
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div className="flex space-x-4 overflow-x-auto py-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="p-4 bg-gray-100 rounded shadow-md animate-pulse min-w-[250px]">
                    <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex xl:flex-col col-span-1 md:col-span-2 xl:col-span-1 md:w-[90vw] xl:w-auto space-x-4 overflow-y-auto xl:space-y-4 xl:overflow-x-auto h-[350px] xl:h-[500px] py-4 px-4 scrollbar-hide">
                {(allUserLocation || []).map((item: ILocation, key: number) => (
                  <div className="text-[#811745] card shadow-lg rounded-lg overflow-hidden min-w-[250px] min-h-[250px]"
                       key={key}>
                    <div className="card-body p-5">
                      <div
                        className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-[#811745] dark:bg-zink-600">
                                        <span className="text-xl font-bold text-white ">
                                            {item.name
                                              .split(' ')
                                              .map((word) => word.charAt(0))
                                              .join('')}
                                        </span>
                      </div>
                      <div className="mt-4 text-center">
                        <h5 className="mb-1 text-xl font-semibold ">
                        {item.name}
                        </h5>
                        <p className="text-slate-500 dark:text-zink-300">
                          {item.address}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-center gap-3">
                        <Button
                          component={Link}
                          variant='contained'
                          href={`tel:${item.phone}`}
                          startIcon={<i className='tabler-phone-call text-xl' />}
                          className='whitespace-nowrap'
                          target='_blank'
                        >
                          Call
                        </Button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default MapsLeaflet;
