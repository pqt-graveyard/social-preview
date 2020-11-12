import classNames from 'classnames';
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Layout } from '../components/Layout';
import { previews } from '../data/defaultPreviews';
import { Spinner } from '../components/loaders/Spinner';
import querystring from 'querystring';

export default function IndexPage(): ReactElement {
  // Input Fields
  const [owner, setOwner] = useState('pqt');
  const [repo, setRepo] = useState('social-preview');
  const [customSeed, setCustomSeed] = useState('');
  const [customToken, setCustomToken] = useState('');

  // Toggle Switches
  const [token, setToken] = useState(false);
  const [darkmode, setDarkmode] = useState(false);
  const [squares, setSquares] = useState(false);
  const [colors, setColors] = useState(true);
  const [seed, setSeed] = useState(false);

  // Display State
  const [repoId, setRepoId] = useState('');
  const [preview, setPreview] = useState(previews.base);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (preview === '') {
      setPreview(previews.base);
    }
  }, [preview]);

  const validationSchema = yup.object().shape({
    owner: yup.string().required('Owner (or Organization) is required'),
    repo: yup.string().required('Repository is required'),
  });

  const {
    errors,
    formState: { isSubmitting, isValid },
    handleSubmit,
    register,
  } = useForm({ mode: 'onChange', validationSchema });

  const handleOwnerChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setOwner(event.currentTarget.value);
  };
  const handleRepoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRepo(event.currentTarget.value);
  };
  const handleCustomTokenChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCustomToken(event.currentTarget.value);
  };

  const onSubmit = handleSubmit(async ({ owner, repo, token }) => {
    let endpoint = `/api/github/${owner}/${repo}`;

    if (token) {
      endpoint = endpoint.concat(`?token=${token}`);
    }

    const parameters = { key: 'value' };
    querystring.stringify(parameters);

    console.log(querystring);

    const response = await fetch(endpoint.toString());
    const { data } = await response.json();

    setShowNotification(false);
    setNotificationMessage('');

    if (!data.error) {
      setPreview(data.image);
      setRepoId(data.id);
    } else {
      setNotificationMessage(data.error);
      setShowNotification(true);
    }
  });

  const Preview = () => (
    <div
      className={classNames(
        'relative inline-flex shadow-sm rounded border border-gray-300 bg-gray-100 p-1 md:p-2 lg:p-3 overflow-hidden transition-opacity items-center',
        isSubmitting && 'opacity-50'
      )}
    >
      <img src={preview} className="w-full rounded border bg-gray-300" />
      {isSubmitting && (
        <div className="absolute inset-0 flex justify-center items-center">
          <Spinner size={60} />
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="fixed top-0 left-0 w-1/2 h-full bg-white"></div>
      <div className="fixed top-0 right-0 w-1/2 h-full bg-gray-50"></div>
      <div className="relative min-h-screen flex flex-col">
        {/* <!-- 3 column wrapper --> */}
        <div className="flex-grow w-full max-w-7xl mx-auto xl:px-8 lg:flex">
          {/* <!-- Left sidebar & main wrapper --> */}
          <div className="flex-1 min-w-0 bg-white xl:flex">
            {/* Profile */}
            <div className="xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-gray-200 bg-white">
              <pre>
                <code>{JSON.stringify(errors, null, 2)}</code>
              </pre>
              <div className="hidden pl-4 pr-6 py-6 sm:pl-6 lg:pl-8 xl:pl-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-8">
                    <div className="space-y-8 sm:space-y-0 sm:flex sm:justify-between sm:items-center xl:block xl:space-y-8">
                      {/* <!-- Profile --> */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-full"
                            src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80"
                            alt=""
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm leading-5 font-medium text-gray-900">Debbie Lewis</div>
                          <a href="#" className="group flex items-center space-x-2.5">
                            <svg
                              className="w-5 h-5 text-gray-400 group-hover:text-gray-500"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.99917 0C4.02996 0 0 4.02545 0 8.99143C0 12.9639 2.57853 16.3336 6.15489 17.5225C6.60518 17.6053 6.76927 17.3277 6.76927 17.0892C6.76927 16.8762 6.76153 16.3104 6.75711 15.5603C4.25372 16.1034 3.72553 14.3548 3.72553 14.3548C3.31612 13.316 2.72605 13.0395 2.72605 13.0395C1.9089 12.482 2.78793 12.4931 2.78793 12.4931C3.69127 12.5565 4.16643 13.4198 4.16643 13.4198C4.96921 14.7936 6.27312 14.3968 6.78584 14.1666C6.86761 13.5859 7.10022 13.1896 7.35713 12.965C5.35873 12.7381 3.25756 11.9665 3.25756 8.52116C3.25756 7.53978 3.6084 6.73667 4.18411 6.10854C4.09129 5.88114 3.78244 4.96654 4.27251 3.72904C4.27251 3.72904 5.02778 3.48728 6.74717 4.65082C7.46487 4.45101 8.23506 4.35165 9.00028 4.34779C9.76494 4.35165 10.5346 4.45101 11.2534 4.65082C12.9717 3.48728 13.7258 3.72904 13.7258 3.72904C14.217 4.96654 13.9082 5.88114 13.8159 6.10854C14.3927 6.73667 14.7408 7.53978 14.7408 8.52116C14.7408 11.9753 12.6363 12.7354 10.6318 12.9578C10.9545 13.2355 11.2423 13.7841 11.2423 14.6231C11.2423 15.8247 11.2313 16.7945 11.2313 17.0892C11.2313 17.3299 11.3937 17.6097 11.8501 17.522C15.4237 16.3303 18 12.9628 18 8.99143C18 4.02545 13.97 0 8.99917 0Z"
                                fill="currentcolor"
                              />
                            </svg>
                            <div className="text-sm leading-5 text-gray-500 group-hover:text-gray-900 font-medium">
                              debbielewis
                            </div>
                          </a>
                        </div>
                      </div>
                      {/* <!-- Action buttons --> */}
                      <div className="flex flex-col space-y-3 sm:space-y-0 sm:space-x-3 sm:flex-row xl:flex-col xl:space-x-0 xl:space-y-3">
                        <span className="inline-flex rounded-md shadow-sm">
                          <button
                            type="button"
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                          >
                            New Project
                          </button>
                        </span>
                        <span className="inline-flex rounded-md shadow-sm">
                          <button
                            type="button"
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                          >
                            Invite Team
                          </button>
                        </span>
                      </div>
                    </div>
                    {/* <!-- Meta info --> */}
                    <div className="flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-6">
                      <div className="flex items-center space-x-2">
                        {/* <!-- Heroicon name: badge-check --> */}
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-500 leading-5 font-medium">Pro Member</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* <!-- Heroicon name: collection --> */}
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        <span className="text-sm text-gray-500 leading-5 font-medium">8 Projects</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview & Required Controls */}
            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="pl-4 pr-6 pt-4 pb-4 border-t border-gray-200 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0">
                <Preview />
                <form className="divide-y divide-gray-200 lg:col-span-9" onSubmit={onSubmit}>
                  {/* <!-- Profile section --> */}
                  <div className="py-6 px-1 space-y-6 lg:pb-8">
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="owner" className="block text-sm font-medium leading-5 text-gray-700">
                          Owner / Organization
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            className={classNames([
                              'form-input block w-full pr-10 sm:text-sm sm:leading-5',
                              errors?.owner
                                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red'
                                : 'text-gray-700',
                            ])}
                            placeholder="pqt"
                            name="owner"
                            ref={register()}
                            onChange={handleOwnerChange}
                            disabled={isSubmitting}
                            defaultValue={owner}
                          />

                          {errors?.owner && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {errors?.owner && (
                          <p className="mt-2 text-sm text-red-600" id="email-error">
                            {(errors?.owner as FieldError)?.message}
                          </p>
                        )}
                      </div>

                      <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="repo" className="block text-sm font-medium leading-5 text-gray-700">
                          Repository
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            className={classNames([
                              'form-input block w-full pr-10 sm:text-sm sm:leading-5',
                              errors?.repo
                                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red'
                                : 'text-gray-700',
                            ])}
                            placeholder="social-preview"
                            name="repo"
                            ref={register()}
                            onChange={handleRepoChange}
                            disabled={isSubmitting}
                            defaultValue={repo}
                          />

                          {errors?.repo && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {errors?.repo && (
                          <p className="mt-2 text-sm text-red-600" id="email-error">
                            {(errors?.repo as FieldError)?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="py-4 space-y-4">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex flex-col">
                          <p id="privacy-option-label-3" className="text-sm leading-5 font-medium text-gray-900">
                            Provide access token
                          </p>
                          <p id="privacy-option-description-3" className="text-sm leading-5 text-gray-500">
                            Provide your own personal access token so you can generate a social preview image for a
                            repository that is not public.
                          </p>
                        </div>

                        {/* <!-- On: "bg-blue-500", Off: "bg-gray-200" --> */}
                        <span
                          role="checkbox"
                          tabIndex={0}
                          aria-checked="true"
                          aria-labelledby="privacy-option-label-4"
                          aria-describedby="privacy-option-description-4"
                          className={classNames([
                            token ? 'bg-blue-500' : 'bg-gray-200',
                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline',
                          ])}
                          onClick={() => setToken(!token)}
                        >
                          {/* <!-- On: "translate-x-5", Off: "translate-x-0" --> */}
                          <span
                            aria-hidden="true"
                            className={classNames([
                              token ? 'translate-x-5' : 'translate-x-0',
                              'inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200',
                            ])}
                          ></span>
                        </span>
                      </div>
                      {token && (
                        <div className="col-span-12">
                          <label htmlFor="customToken" className="block text-sm font-medium leading-5 text-gray-700">
                            Custom Personal Access Token
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              className={classNames([
                                'form-input block w-full pr-10 sm:text-sm sm:leading-5',
                                errors?.customToken
                                  ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red'
                                  : 'text-gray-700',
                              ])}
                              name="customToken"
                              ref={register()}
                              onChange={handleCustomTokenChange}
                              disabled={isSubmitting}
                              defaultValue={customToken}
                            />

                            {errors?.customToken && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          {errors?.customToken && (
                            <p className="mt-2 text-sm text-red-600" id="email-error">
                              {(errors?.customToken as FieldError)?.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Display section */}
                  <div className="pt-6 space-y-4 divide-y divide-gray-200">
                    <div className="px-4 space-y-2 sm:px-6">
                      <div>
                        <h2 className="text-lg leading-6 font-medium text-gray-900">Display Configuration</h2>
                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          Modifications and controls to make it a little bit more unique to you!
                        </p>
                      </div>
                      <ul className="divide-y divide-gray-200">
                        <li className="py-4 flex items-center justify-between space-x-4">
                          <div className="flex flex-col">
                            <p id="privacy-option-label-4" className="text-sm leading-5 font-medium text-gray-900">
                              Darkmode
                            </p>
                            <p id="privacy-option-description-4" className="text-sm leading-5 text-gray-500">
                              Invert the design. Use dark texturing and light text.
                            </p>
                          </div>
                          {/* <!-- On: "bg-blue-500", Off: "bg-gray-200" --> */}
                          <span
                            role="checkbox"
                            tabIndex={0}
                            aria-checked="true"
                            aria-labelledby="privacy-option-label-4"
                            aria-describedby="privacy-option-description-4"
                            className={classNames([
                              darkmode ? 'bg-blue-500' : 'bg-gray-200',
                              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline',
                            ])}
                            onClick={() => setDarkmode(!darkmode)}
                          >
                            {/* <!-- On: "translate-x-5", Off: "translate-x-0" --> */}
                            <span
                              aria-hidden="true"
                              className={classNames([
                                darkmode ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200',
                              ])}
                            ></span>
                          </span>
                        </li>
                        <li className="py-4 flex items-center justify-between space-x-4">
                          <div className="flex flex-col">
                            <p id="privacy-option-label-1" className="text-sm leading-5 font-medium text-gray-900">
                              Squares
                            </p>
                            <p id="privacy-option-description-1" className="text-sm leading-5 text-gray-500">
                              Use squares instead of circles in the dynamic texture
                            </p>
                          </div>
                          {/* <!-- On: "bg-blue-500", Off: "bg-gray-200" --> */}
                          <span
                            role="checkbox"
                            tabIndex={0}
                            aria-checked="true"
                            aria-labelledby="privacy-option-label-4"
                            aria-describedby="privacy-option-description-4"
                            className={classNames([
                              squares ? 'bg-blue-500' : 'bg-gray-200',
                              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline',
                            ])}
                            onClick={() => setSquares(!squares)}
                          >
                            {/* <!-- On: "translate-x-5", Off: "translate-x-0" --> */}
                            <span
                              aria-hidden="true"
                              className={classNames([
                                squares ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200',
                              ])}
                            ></span>
                          </span>
                        </li>
                        <li className="py-4 flex items-center justify-between space-x-4">
                          <div className="flex flex-col">
                            <p id="privacy-option-label-2" className="text-sm leading-5 font-medium text-gray-900">
                              Repository Colors
                            </p>
                            <p id="privacy-option-description-2" className="text-sm leading-5 text-gray-500">
                              Use the{' '}
                              <a
                                className="font-medium text-blue-500"
                                href="https://github.com/github/linguist/blob/master/lib/linguist/languages.yml"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                repository language colors assigned by GitHub
                              </a>
                              .<br />
                              If turned off a provided set of colors will be used instead.
                            </p>
                          </div>
                          {/* <!-- On: "bg-blue-500", Off: "bg-gray-200" --> */}
                          <span
                            role="checkbox"
                            tabIndex={0}
                            aria-checked="true"
                            aria-labelledby="privacy-option-label-4"
                            aria-describedby="privacy-option-description-4"
                            className={classNames([
                              colors ? 'bg-blue-500' : 'bg-gray-200',
                              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline',
                            ])}
                            onClick={() => setColors(!colors)}
                          >
                            {/* <!-- On: "translate-x-5", Off: "translate-x-0" --> */}
                            <span
                              aria-hidden="true"
                              className={classNames([
                                colors ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200',
                              ])}
                            ></span>
                          </span>
                        </li>
                        <li className="py-4 space-y-4">
                          <div className="flex items-center justify-between space-x-4">
                            <div className="flex flex-col">
                              <p id="privacy-option-label-3" className="text-sm leading-5 font-medium text-gray-900">
                                Custom Seed
                              </p>
                              <p id="privacy-option-description-3" className="text-sm leading-5 text-gray-500">
                                Provide your own keyword for generating a new social preview format.
                              </p>
                            </div>
                            {/* <!-- On: "bg-blue-500", Off: "bg-gray-200" --> */}
                            <span
                              role="checkbox"
                              tabIndex={0}
                              aria-checked="true"
                              aria-labelledby="privacy-option-label-4"
                              aria-describedby="privacy-option-description-4"
                              className={classNames([
                                seed ? 'bg-blue-500' : 'bg-gray-200',
                                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline',
                              ])}
                              onClick={() => setSeed(!seed)}
                            >
                              {/* <!-- On: "translate-x-5", Off: "translate-x-0" --> */}
                              <span
                                aria-hidden="true"
                                className={classNames([
                                  seed ? 'translate-x-5' : 'translate-x-0',
                                  'inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200',
                                ])}
                              ></span>
                            </span>
                          </div>
                          {seed && (
                            <div className="col-span-12">
                              <label
                                htmlFor="customToken"
                                className="block text-sm font-medium leading-5 text-gray-700"
                              >
                                Custom Seed
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                  className={classNames([
                                    'form-input block w-full pr-10 sm:text-sm sm:leading-5',
                                    errors?.customSeed
                                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red'
                                      : 'text-gray-700',
                                  ])}
                                  name="customSeed"
                                  ref={register()}
                                  onChange={handleCustomTokenChange}
                                  disabled={isSubmitting}
                                  defaultValue={customSeed}
                                />

                                {errors?.customSeed && (
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {errors?.customSeed && (
                                <p className="mt-2 text-sm text-red-600" id="email-error">
                                  {(errors?.customSeed as FieldError)?.message}
                                </p>
                              )}
                            </div>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Generate and Download Buttons */}
                  <div className="sticky bottom-0 bg-white py-4 flex justify-end space-x-5">
                    <div className="flex-1 flex space-x-4">
                      <span className="inline-flex rounded-md shadow-sm">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                          disabled={isSubmitting || !isValid}
                        >
                          Generate
                        </button>
                      </span>

                      <a
                        className={classNames([
                          'inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-50 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-blue-200 transition transform ease-in-out duration-300',
                          repoId ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none',
                        ])}
                        href={preview}
                        download={`${owner}-${repo}.png`}
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* <!-- Activity feed --> */}
          <div className="bg-gray-50 pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
            <div className="invisible pl-6 lg:w-80">
              <div className="pt-6 pb-2">
                <h2 className="text-sm leading-5 font-semibold text-gray-500">History</h2>
              </div>
              <div>
                <ul className="divide-y divide-gray-200">
                  <li className="py-4 transition duration-500 ease-in-out transform translate-x-8 opacity-0 hover:opacity-100 hover:translate-x-0">
                    <div className="flex space-x-3">
                      <img
                        className="h-6 w-6 rounded-full"
                        src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80"
                        alt=""
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium leading-5">You</h3>
                          <p className="text-sm leading-5 text-gray-500">1h</p>
                        </div>
                        <p className="text-sm leading-5 text-gray-500">
                          Deployed Workcation (2d89f0c8 in master) to production
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
