interface CategoryIconProps {
  category: string
  className?: string
}

export function CategoryIcon({ category, className = "w-12 h-12" }: CategoryIconProps) {
  // Mapping des catégories vers des icônes SVG modernes
  switch (category) {
    case "clothing":
    case "mode-accessoires":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.5 7.5L8.5 3.23C8.5 3.23 9.5 2 12 2C14.5 2 15.5 3.23 15.5 3.23L20.5 7.5L18.5 10.5L15 8.5V22H9V8.5L5.5 10.5L3.5 7.5Z"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "jewelry":
    case "bijoux-ornements":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            className="stroke-current"
            strokeWidth="1.5"
          />
          <path
            d="M12 9L14 11M12 9L10 11M12 9V6M14 11L12 13M14 11H17M12 13L10 11M12 13V16M10 11H7M17 16L14 14M7 16L10 14"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    case "art":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 12C2 17.5228 6.47715 22 12 22C13.6569 22 15 20.6569 15 19C15 18.2316 14.6942 17.5308 14.1973 17.0215C13.7706 16.5814 13.5 15.9874 13.5 15.3264C13.5 14.0256 14.5256 13 15.8264 13H19.5C20.8807 13 22 11.8807 22 10.5C22 6.35786 18.6421 3 14.5 3M12 3C7.02944 3 3 7.02944 3 12C3 13.1046 3.89543 14 5 14C6.10457 14 7 13.1046 7 12C7 10.8954 7.89543 10 9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 5.10457 7 4"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "beauty":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 4.5V16.5M14 16.5L17 14M14 16.5L11 14M9 4.5L7 7L9 9.5L7 12L9 14.5L7 17L9 19.5"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "home":
    case "maison-deco":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 8L11.7317 3.13416C11.9006 3.04971 12.0994 3.04971 12.2683 3.13416L22 8M20 11V19.5C20 19.7761 19.7761 20 19.5 20H4.5C4.22386 20 4 19.7761 4 19.5V11"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17C13.6569 17 15 15.6569 15 14Z"
            className="stroke-current"
            strokeWidth="1.5"
          />
        </svg>
      )
    case "books":
    case "livres-films":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7143"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 8.77975C16 9.38118 15.7625 9.95883 15.3383 10.3861C14.3619 11.3701 13.415 12.3961 12.4021 13.3443C12.17 13.5585 11.83 13.5585 11.5979 13.3443C10.585 12.3961 9.63808 11.3701 8.66171 10.3861C8.23749 9.95883 8 9.38118 8 8.77975C8 7.7872 8.7872 7 9.77975 7C10.4224 7 10.9877 7.32824 11.3419 7.82731C11.5203 8.0745 11.8797 8.0745 12.0581 7.82731C12.4123 7.32824 12.9776 7 13.6202 7C14.6128 7 15.4 7.7872 15.4 8.77975H16Z"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V14"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M4 19H2" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case "accessories":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.5 9.5L12 6L8.5 9.5M12 6V13M18 18H6C4.34315 18 3 16.6569 3 15V9C3 7.34315 4.34315 6 6 6H18C19.6569 6 21 7.34315 21 9V15C21 16.6569 19.6569 18 18 18Z"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "identite-transition":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            className="stroke-current"
            strokeWidth="1.5"
          />
          <path d="M12 8V16M8 12H16" className="stroke-current" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case "diy-creations":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.0503 10.6066L2.97923 17.6777C2.19818 18.4587 2.19818 19.7251 2.97923 20.5061V20.5061C3.76027 21.2872 5.02664 21.2872 5.80769 20.5061L12.8787 13.435M10.0503 10.6066L11.8168 8.84L15.1575 12.1807L13.3909 13.9473M10.0503 10.6066L13.3909 13.9473M19.0919 8.84L15.1575 4.90559L7.7226 12.3404L11.657 16.2748L19.0919 8.84Z"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "sport-loisirs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 10L19.5528 7.72361C20.2177 7.39116 21 7.87465 21 8.61803V15.382C21 16.1253 20.2177 16.6088 19.5528 16.2764L15 14M5 18H13C14.1046 18 15 17.1046 15 16V8C15 6.89543 14.1046 6 13 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "militantisme-communaute":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7 18V17C7 14.2386 9.23858 12 12 12V12C14.7614 12 17 14.2386 17 17V18"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            className="stroke-current"
            strokeWidth="1.5"
          />
        </svg>
      )
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.5 20.5L4.5 15.5M4.5 15.5L2 8.5H6.5M4.5 15.5H9.5M6.5 8.5L8.5 3.5H15.5L17.5 8.5M6.5 8.5H17.5M17.5 8.5L19.5 15.5H14.5M14.5 15.5L15.5 20.5M14.5 15.5H9.5M9.5 15.5L8.5 20.5"
            className="stroke-current"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}

