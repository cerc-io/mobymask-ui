import { useEffect, useState } from "react"
import { isFlask, getSnap } from '../utils/snap';

const initialState = {
  isFlask: false,
  error: undefined,
};

export default function useSnap (provider) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    async function detectFlask() {
      const isFlaskDetected = await isFlask(provider);

      setState(state => ({ ...state, isFlask: isFlaskDetected }))
    }

    async function detectSnapInstalled() {
      const installedSnap = await getSnap();

      setState(state => ({ ...state, installedSnap }))
    }

    detectFlask();

    if (state.isFlask) {
      detectSnapInstalled();
    }
  }, [state.isFlask, provider]);

  return [state, setState]
}
