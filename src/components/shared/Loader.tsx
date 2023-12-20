const Loader = () => {
  return (
    <div className="flex-center w-full">
      {/* <img src="/assets/icons/loader.svg" alt="loader" width={24} height={24} /> */}

      <svg
        width="24"
        height="24"
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
        stroke="pink"
      >
        <g fill="none" fill-rule="evenodd">
          <g transform="translate(1 1)" stroke-width="2">
            <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="5s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Loader
