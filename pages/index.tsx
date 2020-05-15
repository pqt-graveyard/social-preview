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
    owner: yup.string().required(),
    repo: yup.string().required(),
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

    setPreview(data.image);
    setRepoId(data.repo.id);

    // console.log(owner, repo);
    // console.log(data);
    // console.log(data.image);
  });

  return (
    <Layout>
      {/* <Preview  /> */}
      <div className="container">
        <div
          className={classNames([
            'inline-flex rounded-md shadow-sm rounded border border-gray-200 overflow-hidden transition-opacity',
            isSubmitting && 'opacity-50',
          ])}
        >
          <img src={preview} style={{ maxWidth: 1280, maxHeight: 640 }} />
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
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
                  ref={register({
                    required: {
                      value: true,
                      message: 'Owner (or Organization) is required',
                    },
                  })}
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

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
                Repository
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  className={classNames([
                    'form-input block w-full pr-10 sm:text-sm sm:leading-5',
                    errors?.owner
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red'
                      : 'text-gray-700',
                  ])}
                  placeholder="Repository"
                  name="repo"
                  ref={register({
                    required: {
                      value: true,
                      message: 'Repository is required',
                    },
                  })}
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

            <div>
              <span className="inline-flex rounded-md shadow-sm">
                <button
                  type="submit"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                  disabled={isSubmitting || !isValid}
                >
                  Generate
                </button>
              </span>

              {repoId && (
                <span className="inline-flex rounded-md shadow-sm">
                  <a
                    href={preview}
                    download={repoId}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
                  >
                    Download
                  </a>
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};
