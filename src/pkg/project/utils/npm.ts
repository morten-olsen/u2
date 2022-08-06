import { getAbbreviatedPackument } from 'query-registry';

export const getLatestVersion = async (name: string) => {
  const packument = await getAbbreviatedPackument({ name });
  const versions = packument.versions[packument.distTags.latest];
  return versions.version;
};
