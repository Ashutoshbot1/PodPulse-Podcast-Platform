import React from 'react';
import Header from '../Components/Common/Header/Header';
import CreatePodcastForm from '../Components/Forms/CreatePodcastForm/CreatePodcastForm';

const CreatePodcastPage = () => {
  return (
    <div>
      <Header/>
      <div className='input-wrapper'>

      <CreatePodcastForm/>
      </div>
    </div>
  )
}

export default CreatePodcastPage
