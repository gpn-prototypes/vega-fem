import uniqid from 'uniqid';

const keyGen = (key: number | string): string => uniqid(key.toString());

export default keyGen;
