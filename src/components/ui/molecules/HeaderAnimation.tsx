import React, { useEffect } from 'react'
import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceString
} from '@rive-app/react-webgl2'

const HeaderAnimation = () => {
  // 1. Initialize useRive with autoBind: false
  const { rive, RiveComponent } = useRive({
    src: '/animations/hero-animation.riv',
    artboard: 'HEADER',
    autoplay: true,
    autoBind: false // Important!
  })

  // 2. Get the ViewModel definition by name
  const viewModel = useViewModel(rive, { name: 'ViewModel1' })

  // 3. Get the default instance of the ViewModel and bind it to the Rive instance
  const viewModelInstance = useViewModelInstance(viewModel, { rive })

  // 4. Now you can use property hooks with the instance
  const { setValue: setTitle } = useViewModelInstanceString('title', viewModelInstance)

  useEffect(() => {
    if (setTitle) {
      setTitle('Rive Stocks Dashboard')
    }
  }, [setTitle])

  return <RiveComponent />
}
export default HeaderAnimation
