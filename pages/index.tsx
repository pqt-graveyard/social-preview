import classNames from 'classnames';
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { FieldError, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Layout } from '../components/Layout';
import { defaultPreview } from '../data/defaultPreview';

export default (): ReactElement => {
  const [owner, setOwner] = useState('pqt');
  const [repo, setRepo] = useState('social-preview');
  const [repoId, setRepoId] = useState('');
  const [preview, setPreview] = useState(defaultPreview);

  useEffect(() => {
    if (preview === '') {
      setPreview(defaultPreview);
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

  const onSubmit = handleSubmit(async ({ owner, repo }) => {
    const response = await fetch(`/api/github/${owner}/${repo}`);
    const { data } = await response.json();

    if (!data.error) {
      setPreview(data.image);
      setRepoId(data.repo.id);
    }
  });

  return (
    <Layout>
      {/* <Preview  /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="max-w-3xl mx-auto">
          <div
            className={classNames([
              'inline-flex rounded-md shadow-sm rounded border border-gray-300 bg-gray-100 p-3 overflow-hidden transition-opacity',
              isSubmitting && 'opacity-50',
            ])}
          >
            <img
              src={preview}
              style={{ maxWidth: 1280, maxHeight: 640 }}
              className="w-full rounded border bg-gray-300"
            />
          </div>

          <form onSubmit={onSubmit}>
            <div className="space-y-4 pt-8">
              <div className="flex flex-row w-full space-x-8">
                <div className="flex-1">
                  <label htmlFor="owner" className="block text-sm font-medium leading-5 text-gray-700">
                    Owner
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      className={classNames([
                        'form-input block w-full pr-10 sm:text-sm sm:leading-5',
                        errors?.owner
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red'
                          : 'text-gray-700',
                      ])}
                      placeholder="Owner / Org"
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

                <div className="flex-1">
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
                      placeholder="Repository"
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

              <div className="space-x-4">
                <span className="inline-flex rounded-md shadow-sm">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                    disabled={isSubmitting || !isValid}
                  >
                    Generate
                  </button>
                </span>

                {repoId && (
                  <a
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-50 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo active:bg-indigo-200 transition ease-in-out duration-150"
                    href={preview}
                    download={repoId}
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end hidden">
        {/* <!--
    Notification panel, show/hide based on alert state.

    Entering: "transform ease-out duration-300 transition"
      From: "translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      To: "translate-y-0 opacity-100 sm:translate-x-0"
    Leaving: "transition ease-in duration-100"
      From: "opacity-100"
      To: "opacity-0"
  --> */}
        <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto">
          <div className="rounded-lg shadow-xs overflow-hidden">
            <div className="p-4">
              <div className="flex items-center">
                <div className="w-0 flex-1 flex justify-between">
                  <p className="w-0 flex-1 text-sm leading-5 font-medium text-gray-900">Discussion archived</p>
                  <button className="ml-3 flex-shrink-0 text-sm leading-5 font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                    Undo
                  </button>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
