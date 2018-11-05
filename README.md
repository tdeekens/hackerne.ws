## Hackerne.ws client

<p align="center">
  <a href="https://travis-ci.org/tdeekens/hackerne.ws">
    <img alt="TravisCI Status" src="https://travis-ci.org/tdeekens/hackerne.ws.svg?branch=master">
  </a>
</p>

This is a small experimental, small hackernews client built to experiment with Service Workers and Intersection Observers. It supports the following features:

1. Fetch stories sequentially as fast as possible
   - Rendering them one by one
2. Infinte scrolling using an `IntersectionObserver`
   - With different loading states: given all have been loaded, an error occured or fetching is in progress
3. Offline support using a Service Worker
   - When offline the app will still load
   - When online requests are served from the cache if possible for rendering performance while the cache is invalided after

  <img alt="gif" src="https://raw.githubusercontent.com/tdeekens/hackerne.ws/master/hackerne.ws.gif" />

## Quick Start

1. Please first install dependencies with either `yarn` or `npm`.
2. Run `yarn start` or `npm run start`
   - This will start both server and client with HMR

## Tests

1. Tests are called `*.spec.js` are are co-located with the components/modules
2. Run `yarn test` or `yarn test --watch` to run them via Jest
3. TravisCI is configured to run them too [here](https://travis-ci.org/tdeekens/hackerne.ws)

## Architectural Decisions

1. Built using React as a "thin" view layer
   - No custom, small or big state management library needed yet
2. Seperate concerns: small components, services and utils
   - Loading stories is not a React concern and implemented in services
   - Tests illustrated at various layers (not 100% coverage yet)
3. Use as few libraries as possible (without sacrificing maintainability)
   - No library for infinte scrolling but a custom component
4. Use razzle (similar to create-react-app) for tooling to not setup stack
5. The Service Worker follow a cache then network approach
   - Even if an cache entry is found a proactive network request is triggered to potentially invalidate the cache

## Follow ups

1. Increase test coverage (especially services)
    - Other tests give an example how this could look like
2. The Service Worker just prune old versions from the cache
    - Not needed for now but could be useful to not surpass a maximum cache size
3. Add server-side rendering which could speed up initial loading even more (as some requests are likely mostly cached already)
