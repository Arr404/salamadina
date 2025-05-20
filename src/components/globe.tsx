import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import { TextureLoader } from 'three';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/init';
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button';

import useMediaQuery from '@mui/material/useMediaQuery';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';

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

const Scene = ({
  locations,
  selectedLocation,
  onLocationClick
}: {
  locations: ILocation[],
  selectedLocation: ILocation | null,
  onLocationClick: (location: ILocation) => void
}) => {
  return (
    <>
      {/* Add proper lighting */}
      <ambientLight intensity={2} />
      <group rotation={[Math.PI, 0, 0]}>
        <directionalLight position={[0, 1, 5]} intensity={4} />
      </group>

      <Earth
        locations={locations}
        selectedLocation={selectedLocation}
        onLocationClick={onLocationClick}
      />
    </>
  );
};

const Earth = ({
  locations = [],
  selectedLocation,
  onLocationClick
}: {
  locations: ILocation[],
  selectedLocation: ILocation | null,
  onLocationClick: (location: ILocation) => void
}) => {
  const earthTexture = useLoader(TextureLoader, '/images/earth_texture.jpg');

  return (
    <mesh rotation={[0, 0, 0]}>
      <sphereGeometry args={[4, 128, 128]} />
      <meshStandardMaterial
        map={earthTexture}
        metalness={0.1}    // Reduced metalness
        roughness={0.8}    // Increased roughness
        color={0xffffff}   // White color to show texture properly
      />
      {locations.map((location, index) => {
        const shouldShow = !selectedLocation || (selectedLocation.id === location.id);
        if (!shouldShow || location.lat === null || location.long === null) return null;

        const radius = 4.1;
        const latRad = ((location.lat ?? 0  )  ) * Math.PI / 180;
        const lonRad = ((location.long ?? 0  ) + 90 )* Math.PI / 180;

        const x = radius * Math.cos(latRad) * Math.sin(lonRad);
        const y = radius * Math.sin(latRad);
        const z = radius * Math.cos(latRad) * Math.cos(lonRad);

        return (
          <mesh
            key={location.id || index}
            position={[x, y, z]}
            onClick={() => onLocationClick(location)}
          >
            <sphereGeometry args={[0.01, 16, 16]} /> {/* Changed from tubeGeometry */}
            <meshBasicMaterial
              color="#811745"
              transparent
              opacity={selectedLocation?.id === location.id ? 0.9 : 0.6}
            />
          </mesh>
        );
      })}

    </mesh>
  );
};

const AgentsList = ({
  agents,
  selectedAgent,
  onSelect,
  onClose,
  isOpen
}: {
  agents: ILocation[],
  selectedAgent: ILocation | null,
  onSelect: (agent: ILocation) => void,
  onClose: () => void,
  isOpen?: boolean
}) => {
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('');
  };

  if (selectedAgent) {
    return (
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-50">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-2xl rounded-lg overflow-hidden w-[300px]">
          <div className="relative p-5">
            <Button
              variant="text"
              className="absolute top-2 right-2 text-white/70 hover:text-white"
              onClick={onClose}
            >
              <i className="tabler-x text-xl" />
            </Button>

            <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full overflow-hidden">
              {selectedAgent.profileImage ? (
                <img
                  src={selectedAgent.profileImage}
                  alt={selectedAgent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#811745] flex items-center justify-center">
                  <span className="text-xl font-bold">
                    {getUserInitials(selectedAgent.name)}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
              <h5 className="mb-1 text-xl font-semibold text-white">
                {selectedAgent.name}
              </h5>
              <p className="text-white/70">
                {selectedAgent.address}
              </p>
            </div>

            <div className="mt-4 flex justify-center gap-3">
              <Button
                component={Link}
                variant="contained"
                href={`tel:${selectedAgent.phone}`}
                startIcon={<i className="tabler-phone-call text-xl" />}
                className="whitespace-nowrap"
                target="_blank"
              >
                Call
              </Button>
              <Button
                component={Link}
                variant="contained"
                href={`https://www.google.com/maps?q=${selectedAgent.lat},${selectedAgent.long}`}
                startIcon={<i className="tabler-map-pin text-xl" />}
                className="whitespace-nowrap"
                target="_blank"
              >
                Maps
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute right-0 top-12 bottom-0 w-[320px] bg-black/40 backdrop-blur-md border-l border-white/10 z-50
      ${isOpen ? '' : 'hidden'} sm:block`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-white/10">
          <Typography className="text-white font-semibold">
            All Agents ({agents.length})
          </Typography>
        </div>
        <div className="flex-1 overflow-y-auto">
          {agents.map((agent) => (
            <button
              key={agent.id || agent.number}
              onClick={() => onSelect(agent)}
              className="w-full text-left flex items-center gap-4 p-3 border-b border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                {agent.profileImage ? (
                  <img
                    src={agent.profileImage}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#811745] flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {getUserInitials(agent.name)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <h6 className="text-sm font-semibold text-white truncate">{agent.name}</h6>
                <p className="text-xs text-white/70 truncate">{agent.address}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const MapsGlobe = () => {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [selectedUser, setSelectedUser] = useState<ILocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDesktop = useMediaQuery('(min-width: 640px)'); // sm breakpoint in Tailwind
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);

  const toggleAgentsDrawer = () => setIsAgentsOpen(p => !p);

  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'agents'));
        const agentData: ILocation[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ILocation));
        setLocations(agentData);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agents data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleLocationSelect = (location: ILocation) => {
    setSelectedUser(location);
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      <div className="relative w-full h-screen">
        {/* Globe */}
        <div className="absolute inset-0">
          {error ? (
            <Alert severity="error" className="m-4">{error}</Alert>
          )  : (
            <Canvas
              camera={{ position: [-4, 0, -8], fov: 45 }}  // Changed from [0, 0, 8]
              style={{ width: '100%', height: '100%' }}
            >
              <color attach="background" args={['#000000']} />
              <Scene
                locations={locations}
                selectedLocation={selectedUser}
                onLocationClick={handleLocationSelect}
              />
              <OrbitControls
                enableZoom={true}
                minDistance={5}
                maxDistance={24}
                enablePan={false}
              />
            </Canvas>
          )}
        </div>

        {/* Header overlay */}
        <div className="absolute inset-x-0 top-12 z-10 pt-8 px-4">
          <div className="flex flex-col items-center gap-y-4">
            <Chip
              size='small'
              className="text-white bg-[#811745]"
              variant='filled'
              color='primary'
              label='Our Agents'
            />
            <Typography variant='h4' className='text-center text-white'>
              <span className='font-extrabold'>All</span>{' '} Agents
            </Typography>
          </div>
        </div>

        <div className="absolute top-16 left-4 z-50 sm:hidden">
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={toggleAgentsDrawer}
          >
            {isAgentsOpen ? <CloseIcon /> : <MenuIcon />}
          </Button>
        </div>

        {/* Agents drawer */}
        <AgentsList
          agents={locations}
          selectedAgent={selectedUser}
          onSelect={handleLocationSelect}
          onClose={handleClose}
          isOpen={isDesktop || isAgentsOpen}   // 👈  always open on desktop
        />
      </div>
    </div>
  );
};

export default MapsGlobe;
