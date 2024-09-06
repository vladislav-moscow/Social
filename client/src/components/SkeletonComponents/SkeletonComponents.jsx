import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Импортируйте стили для скелетов

export const ShareSkeleton = () => (
  <div className='share'>
    <div className='shareWrapper'>
      <div className='shareTop'>
        <Skeleton circle={true} height={50} width={50} />
        <Skeleton height={40} width={300} style={{ marginLeft: '10px' }} />
      </div>
      <hr className='shareHr' />
      <Skeleton height={200} width='100%' />
      <div className='shareBottom'>
        <div className='shareOptions'>
          <div className='shareOption'>
            <Skeleton circle={true} height={24} width={24} />
            <Skeleton width={80} style={{ marginLeft: '10px' }} />
          </div>
          <div className='shareOption'>
            <Skeleton circle={true} height={24} width={24} />
            <Skeleton width={80} style={{ marginLeft: '10px' }} />
          </div>
          <div className='shareOption'>
            <Skeleton circle={true} height={24} width={24} />
            <Skeleton width={80} style={{ marginLeft: '10px' }} />
          </div>
        </div>
        <Skeleton height={40} width={100} />
      </div>
    </div>
  </div>
);

export const SidebarSkeleton = () => (
  <div className='sidebar'>
    <div className='sidebarWrapper'>
      <Skeleton height={30} width={120} />
      <h2 className='sidebarMyFriend'>
        <Skeleton width={100} height={30} />
      </h2>
      <ul className='sidebarFriendList'>
        {Array(5).fill().map((_, index) => (
          <li key={index}>
            <Skeleton height={35} width={200} />
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const SkeletonRightbar = () => (
  <div>
    <Skeleton height={40} />
    <Skeleton height={60} count={5} />
  </div>
);