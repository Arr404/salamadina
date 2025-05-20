import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView } from "framer-motion";
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/init';

const Globe = dynamic(
  () => import('react-globe.gl').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-screen">
        <CircularProgress color="primary" />
        <Typography className="mt-4 text-white">Loading globe visualization...</Typography>
      </div>
    )
  }
);

interface ILocation {
  id?: string;
  number: number;
  name: string;
  address: string;
  phone: string | null;
  lat: number | null;
  long: number | null;
  profileImage?: string;
}

interface IGlobeMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  address: string;
  phone: string | null;
  profileImage?: string;
  color: string;
  size: number;
}

const MapsGlobe = () => {
  const [allUserLocation, setAllUserLocation] = useState<ILocation[] | null>(null);
  const [markers, setMarkers] = useState<IGlobeMarker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGlobeReady, setIsGlobeReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<ILocation | null>(null);
  const globeRef = useRef<any>(null);
  const globeContainerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(globeContainerRef, { amount: 0.3 });

  const convertToMarkers = (agents: ILocation[]): IGlobeMarker[] => {
    return agents
      .filter(agent => agent.lat !== null && agent.long !== null)
      .map(agent => ({
        id: agent.id || `agent-${agent.number}`,
        lat: agent.lat!,
        lng: agent.long!,
        name: agent.name,
        address: agent.address,
        phone: agent.phone,
        profileImage: agent.profileImage,
        color: '#811745',
        size: 0.05
      }));
  };

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const querySnapshot = await getDocs(collection(db, 'agents'));
        const agentData: ILocation[] = [];

        querySnapshot.forEach((doc) => {
          agentData.push({ id: doc.id, ...doc.data() } as ILocation);
        });

        setAllUserLocation(agentData);
        setMarkers(convertToMarkers(agentData));

        setTimeout(() => {
          if (globeRef.current) {
            globeRef.current.pointOfView(
              { lat: -2.5, lng: 118.0, altitude: 0.4 },
              2000
            );
          }
        }, 500);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agents data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleMarkerClick = (point: any, event: MouseEvent, coords: {lat: number, lng: number, altitude: number}) => {
    const markerId = point.id;
    const user = allUserLocation?.find(u => u.id === markerId);
    if (user) {
      setSelectedUser(user);
    }
  };

  const handleGoBack = () => {
    setSelectedUser(null);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('');
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Starry background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(to bottom, #000000, #111122)',
          zIndex: 0
        }}
      />

      {/* Main container for both globe and overlay content */}
      <div className="relative w-full h-screen">
        {/* Globe */}
        <div className="absolute inset-0">
          {error ? (
            <Alert severity="error" className="mb-4">{error}</Alert>
          ) : isLoading || !isGlobeReady ? (
            <div className="flex flex-col items-center justify-center h-full">
              <CircularProgress color="primary" />
              <Typography className="mt-4 text-white">
                {isLoading ? 'Loading agents...' : 'Preparing globe visualization...'}
              </Typography>
            </div>
          ) : (
            typeof window !== 'undefined' && (
              <Globe
                ref={globeRef}
                globeImageUrl="images/earth_texture.jpg"
                backgroundImageUrl="none"
                pointsData={markers}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointRadius="size"
                pointLabel="name"
                onPointClick={handleMarkerClick}
                pointAltitude={0.005}
                enablePointerInteraction={true}
                animateIn={true}
                showAtmosphere={true}
                atmosphereAltitude={0.25}
                atmosphereColor="rgba(255, 255, 255, 0.3)"
                width={window.innerWidth}
                height={window.innerHeight}
                onGlobeReady={() => setIsGlobeReady(true)}
              />
            )
          )}
        </div>

        {/* Overlay content */}
        <div className="absolute inset-x-0 top-0 z-50 pt-8 px-4">
          <div className="flex flex-col items-center gap-y-4">
            <Chip
              size='small'
              className="text-white bg-[#811745]"
              variant='tonal'
              color='primary'
              label='Agents'
            />
            <div className='flex flex-col items-center gap-y-1 justify-center'>
              <Typography variant='h4' className='text-center text-white'>
                <span className='text-bold font-extrabold'>
                  All Agents
                </span>{' '}
                In Indonesia
              </Typography>
              <Typography className='text-center text-white/80'>
                Find one near you
              </Typography>
            </div>
          </div>
        </div>

        {/* Selected user card */}
        {selectedUser && (
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-50">
            <div className="bg-white/90 backdrop-blur-sm text-[#811745] card shadow-lg rounded-lg overflow-hidden w-[300px]">
              <div className="card-body p-5">
                <Button
                  variant="text"
                  startIcon={<i className="tabler-pointer-cancel text-xl" />}
                  className="absolute top-2 right-2"
                  onClick={handleGoBack}
                />

                <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full overflow-hidden">
                  {selectedUser.profileImage ? (
                    <img
                      src={selectedUser.profileImage}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#811745] flex items-center justify-center text-white">
                      <span className="text-xl font-bold">
                        {getUserInitials(selectedUser.name)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <h5 className="mb-1 text-xl font-semibold">
                    {selectedUser.name}
                  </h5>
                  <p className="text-slate-500">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MapsGlobe;
