import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormField, Modal } from '../components';
import DeviceCard from '../components/DeviceCard';
import { useEffect, useRef, useState } from 'react';
import useDevice from '../services/useDevice';
import { IDevice } from '../@types/device';
import { useMutation, useQuery } from 'react-query';
import useNotifier from '../hooks/useNotifier';
import * as yup from 'yup';
//@ts-ignore
import Loading from '../assets/loading-button.svg?react';
import useDebounceCallback from '../hooks/useDebounceCallback';
import { useNavigate } from 'react-router-dom';

export default function Devices() {
  const { notify } = useNotifier();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>('');
  const [devices, setDevices] = useState<IDevice[]>([]);
  const [device, setDevice] = useState<IDevice | null>(null);
  const firstRender = useRef(true);
  const navigate = useNavigate();

  const validations = yup.object().shape({
    name: yup.string().required('O nome do dispositivo é obrigatório'),
    description: yup.string().required('A descrição do dispositivo é obrigatória'),
  });

  const {
    register: registerForm,
    formState: { errors: errorForm },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    defaultValues: { name: '', description: '' },
    resolver: yupResolver(validations),
  });

  const {
    register: registerFilters,
    formState: { errors: errorsFilter },
  } = useForm({
    defaultValues: { search: '' },
  });

  const { postDevice, getDevices, updateDevice, deleteDevice } = useDevice();

  const postDeviceMutation = useMutation(postDevice);
  const updateDeviceMutation = useMutation(updateDevice);
  const deleteDeviceMutation = useMutation(deleteDevice);

  const getDevicesQuery = useQuery(['devices', page, search], () => getDevices({ page, limit: 20, search }), {
    keepPreviousData: false,
    onSuccess(response) {
      setDevices((devices) => [...devices, ...response.items]);
    },
  });

  function onSubmit(values: Omit<IDevice, 'id' | 'created_at' | 'updated_at'>) {
    if (device) {
      updateDeviceMutation.mutate(
        { id: device.id, ...values },
        {
          onSuccess(response) {
            if ('error' in response) {
              return notify(response.error as string, 'error');
            }

            setPage(1);
            setDevices([]);
            getDevicesQuery.refetch();
            notify(response.message, 'success');
          },
        },
      );
    } else {
      postDeviceMutation.mutate(values, {
        onSuccess(response) {
          if ('error' in response) {
            return notify(response.error as string, 'error');
          }

          setPage(1);
          setDevices([]);
          reset();
          getDevicesQuery.refetch();
          setOpen(false);
          notify(response.message, 'success');
        },
      });
    }
  }

  function handleDelete(id: string) {
    deleteDeviceMutation.mutate(id, {
      onSuccess(response) {
        setPage(1);
        setDevices([]);
        getDevicesQuery.refetch();
        notify(response.message, 'success');
      },
      onError(error: any) {
        notify(error.message, 'error');
      },
    });
  }

  useEffect(() => {
    if (firstRender.current && getDevicesQuery.data) {
      firstRender.current = false;
      getDevicesQuery.refetch();
    }
  }, [getDevicesQuery.data]);

  const debouncedSearch = useDebounceCallback((search: string) => {
    setDevices([]);
    setPage(1);
    setSearch(search);
  });

  return (
    <section className="h-screen bg-neutral-900 px-5 flex flex-col gap-14">
      <Modal
        display={open}
        title={'Cadastrar dispositivo'}
        onClose={() => {
          if (device) setDevice(null);
          setOpen(false);
        }}
        className="flex flex-col gap-4"
      >
        <FormField
          register={registerForm}
          error={errorForm}
          name="name"
          label="Nome"
          placeholder="Nome do seu dispositivo"
        />
        <FormField
          register={registerForm}
          error={errorForm}
          name="description"
          label="Descrição"
          placeholder="Descrição do seu dispositivo"
        />
        <Button
          onClick={handleSubmit(onSubmit)}
          loading={postDeviceMutation.isLoading || updateDeviceMutation.isLoading}
        >
          Salvar
        </Button>
      </Modal>
      <div className="flex justify-end gap-4 items-center mt-10">
        <FormField
          register={registerFilters}
          error={errorsFilter}
          name="search"
          type="search"
          placeholder="Buscar dispositivos..."
          className="w-96"
          customOnChange={debouncedSearch}
        />
        <Button onClick={() => setOpen(true)}>Adicionar dispositivo</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {!getDevicesQuery.isFetching && !devices.length && (
          <p className="col-span-full text-center text-2xl text-neutral-400 animate-pulse">
            Nenhum dispositivo encontrado. Tente cadastrar um novo dispositivo.
          </p>
        )}
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            title={device.name}
            description={device.description}
            date={device.created_at}
            onEdit={() => {
              setValue('name', device.name);
              setValue('description', device.description);
              setDevice(device);
              setOpen(true);
            }}
            onDelete={() => handleDelete(device.id)}
            onClick={() => {
              navigate('/dashboard/' + device.id);
            }}
          />
        ))}
        {getDevicesQuery.isFetching && (
          <div className="col-span-full flex justify-center">
            <Loading className="fill-blue-400 animate-spin w-12 h-12" />
          </div>
        )}
      </div>
    </section>
  );
}
