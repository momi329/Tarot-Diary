import { useState, useEffect } from "react";
import { createApi } from "unsplash-js";
import { FiX } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
import { FiImage } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
const Key = "AWr7OjSG0r2bv8pN9qden-TzwtbIWY41bFiKsTF3xKw";

function MyImages({ onSave, setOnSave }) {
  const [photos, setPhotos] = useState(fakeData);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const fetchPhotos = async (search) => {
    const unsplash = createApi({ accessKey: Key });
    unsplash.photos
      .getRandom({
        count: 15,
        page: 1,
        query: search,
        orientation: "landscape",
      })
      .then((result) => {
        if (result.errors) {
          // handle error here
          console.log("error occurred: ", result.errors[0]);
        } else {
          // handle success here
          const photo = result.response;
          setPhotos(photo);
          console.log(photo);
        }
      });
  };
  useEffect(() => {
    fetchPhotos("spirit");
  }, []);
  //暫時關掉
  const chooseImg = (img) => {
    setOnSave({ ...onSave, image: img });
    return;
  };
  const searchImg = (e) => {
    if (e.key === "Enter") {
      fetchPhotos(input);
    }
  };
  return (
    <>
      <div
        className='w-[500px] h-[250px] border-2 relative bg-cover bg-center'
        style={{ backgroundImage: `url(${onSave.image})` }}
      >
        <FiImage
          className='w-5 h-5 absolute top-1 right-1'
          onClick={() => {
            setIsOpen(true);
          }}
        />
        {isOpen && (
          <div
            className='w-[350px]  flex flex-wrap flex-col  
          p-4 pt-1 bg-slate-200 absolute top-0 right-0 z-30 '
          >
            <div
              className='w-[100%] flex flex-wrap  flex-row items-center 
            justify-between p-3 mb-3 border-b-[1px] border-slate-300'
            >
              <FiChevronLeft className='w-5 h-5' />
              <div className='tracking-wide'>更換背景</div>
              <FiX
                className='w-5 h-5'
                onClick={() => {
                  setIsOpen(false);
                }}
              />
            </div>
            <div className='w-[100%] relative'>
              <FiSearch className='absolute top-3 left-2 text-slate-400' />
              <input
                className='w-[100%] p-2  mb-3 pl-7'
                placeholder='Search'
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  searchImg(e);
                }}
              />
            </div>

            <div className='h-[400px] flex flex-wrap justify-center gap-2  overflow-auto '>
              {photos.map((photo) => (
                <>
                  <div
                    key={photo.id}
                    className='w-[140px] h-[100px] object-contain rounded-ms hover:opacity-80 bg-cover bg-center relative cursor-pointer'
                    style={{ backgroundImage: `url(${photo.urls.regular})` }}
                    onClick={() => {
                      chooseImg(photo.urls.regular);
                    }}
                  >
                    <div className='w-[100%] absolute bottom-0 p-[4px] pl-2 bg-slate-900 text-white  underline-offset-1 opacity-0 hover:opacity-80'>
                      <a href={photo.links.html} className=' text-xs'>
                        {photo.user.name}
                      </a>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MyImages;

const fakeData = [
  {
    id: "O-E2JjDGBqw",
    created_at: "2023-03-20T00:41:17Z",
    updated_at: "2023-04-03T19:38:12Z",
    promoted_at: "2023-03-23T18:32:02Z",
    width: 6000,
    height: 4000,
    color: "#f3f3f3",
    blur_hash: "LBRysg4n00D%-;t7t7ofRjayWBof",
    description: null,
    alt_description: "a tall building with a clock on the side of it",
    urls: {
      raw: "https://images.unsplash.com/photo-1679272482367-fcdf720e9fe4?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3",
      full: "https://images.unsplash.com/photo-1679272482367-fcdf720e9fe4?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=85",
      regular:
        "https://images.unsplash.com/photo-1679272482367-fcdf720e9fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=1080",
      small:
        "https://images.unsplash.com/photo-1679272482367-fcdf720e9fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=400",
      thumb:
        "https://images.unsplash.com/photo-1679272482367-fcdf720e9fe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=200",
      small_s3:
        "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1679272482367-fcdf720e9fe4",
    },
    links: {
      self: "https://api.unsplash.com/photos/O-E2JjDGBqw",
      html: "https://unsplash.com/photos/O-E2JjDGBqw",
      download:
        "https://unsplash.com/photos/O-E2JjDGBqw/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
      download_location:
        "https://api.unsplash.com/photos/O-E2JjDGBqw/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
    },
    likes: 12,
    liked_by_user: false,
    current_user_collections: [],
    sponsorship: null,
    topic_submissions: {},
    user: {
      id: "3NXRVDpvx9w",
      updated_at: "2023-04-04T07:16:27Z",
      username: "divineconduit",
      name: "Emmett Husmann",
      first_name: "Emmett",
      last_name: "Husmann",
      twitter_username: null,
      portfolio_url: null,
      bio: "Unsplash has been one of my favorite resources for nearly a decade, and now I'm trying to improve at my own photography so I too can contribute to this community.",
      location: "Indianapolis, IN",
      links: {
        self: "https://api.unsplash.com/users/divineconduit",
        html: "https://unsplash.com/@divineconduit",
        photos: "https://api.unsplash.com/users/divineconduit/photos",
        likes: "https://api.unsplash.com/users/divineconduit/likes",
        portfolio: "https://api.unsplash.com/users/divineconduit/portfolio",
        following: "https://api.unsplash.com/users/divineconduit/following",
        followers: "https://api.unsplash.com/users/divineconduit/followers",
      },
      profile_image: {
        small:
          "https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
        medium:
          "https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
        large:
          "https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
      },
      instagram_username: null,
      total_collections: 0,
      total_likes: 27,
      total_photos: 14,
      accepted_tos: true,
      for_hire: false,
      social: {
        instagram_username: null,
        portfolio_url: null,
        twitter_username: null,
        paypal_email: null,
      },
    },
    exif: {
      make: "Canon",
      model: " EOS M50m2",
      name: "Canon, EOS M50m2",
      exposure_time: "1/250",
      aperture: "6.3",
      focal_length: "45.0",
      iso: 200,
    },
    location: {
      name: "Indianapolis, IN, USA",
      city: "Indianapolis",
      country: "United States",
      position: {
        latitude: 39.768403,
        longitude: -86.158068,
      },
    },
    views: 206661,
    downloads: 1791,
  },
  {
    id: "NEy5Au5joD4",
    created_at: "2023-03-30T18:09:15Z",
    updated_at: "2023-04-04T02:40:59Z",
    promoted_at: "2023-04-02T15:16:17Z",
    width: 6016,
    height: 4016,
    color: "#260c0c",
    blur_hash: "L58pfet69aV?=~R%}[-V=}SzsmsA",
    description: null,
    alt_description: "a very long exposure of a city street at night",
    urls: {
      raw: "https://images.unsplash.com/photo-1680199693427-4a31f8ffc531?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3",
      full: "https://images.unsplash.com/photo-1680199693427-4a31f8ffc531?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=85",
      regular:
        "https://images.unsplash.com/photo-1680199693427-4a31f8ffc531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=1080",
      small:
        "https://images.unsplash.com/photo-1680199693427-4a31f8ffc531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=400",
      thumb:
        "https://images.unsplash.com/photo-1680199693427-4a31f8ffc531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=200",
      small_s3:
        "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1680199693427-4a31f8ffc531",
    },
    links: {
      self: "https://api.unsplash.com/photos/NEy5Au5joD4",
      html: "https://unsplash.com/photos/NEy5Au5joD4",
      download:
        "https://unsplash.com/photos/NEy5Au5joD4/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
      download_location:
        "https://api.unsplash.com/photos/NEy5Au5joD4/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
    },
    likes: 43,
    liked_by_user: false,
    current_user_collections: [],
    sponsorship: null,
    topic_submissions: {},
    user: {
      id: "sfnpV27ILJ0",
      updated_at: "2023-04-03T16:14:37Z",
      username: "andrewnef",
      name: "Andrew Haimerl",
      first_name: "Andrew",
      last_name: "Haimerl",
      twitter_username: null,
      portfolio_url: "http://youtube.com/@andrewnef",
      bio: "Andrew is a published cyberpunk/street photography with 30,000,000+ views on Unsplash that has been used by major outlets and companies like Yahoo, The Conversation, Greenpeace, and others!",
      location: "Taipei",
      links: {
        self: "https://api.unsplash.com/users/andrewnef",
        html: "https://unsplash.com/@andrewnef",
        photos: "https://api.unsplash.com/users/andrewnef/photos",
        likes: "https://api.unsplash.com/users/andrewnef/likes",
        portfolio: "https://api.unsplash.com/users/andrewnef/portfolio",
        following: "https://api.unsplash.com/users/andrewnef/following",
        followers: "https://api.unsplash.com/users/andrewnef/followers",
      },
      profile_image: {
        small:
          "https://images.unsplash.com/profile-1668662112410-ccfbc8d94948image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
        medium:
          "https://images.unsplash.com/profile-1668662112410-ccfbc8d94948image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
        large:
          "https://images.unsplash.com/profile-1668662112410-ccfbc8d94948image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
      },
      instagram_username: "andrewnef.mp4",
      total_collections: 0,
      total_likes: 0,
      total_photos: 77,
      accepted_tos: true,
      for_hire: true,
      social: {
        instagram_username: "andrewnef.mp4",
        portfolio_url: "http://youtube.com/@andrewnef",
        twitter_username: null,
        paypal_email: null,
      },
    },
    exif: {
      make: null,
      model: null,
      name: null,
      exposure_time: null,
      aperture: null,
      focal_length: null,
      iso: null,
    },
    location: {
      name: null,
      city: null,
      country: null,
      position: {
        latitude: 0,
        longitude: 0,
      },
    },
    views: 556739,
    downloads: 2633,
  },
  {
    id: "H6qOxrWySSU",
    created_at: "2023-03-19T01:40:17Z",
    updated_at: "2023-04-04T05:38:48Z",
    promoted_at: "2023-03-19T11:48:01Z",
    width: 7680,
    height: 4800,
    color: "#73268c",
    blur_hash: "LhHuuoS60~$l$yS2I[s.AAWVs+bD",
    description: null,
    alt_description: "an abstract background with a wavy design",
    urls: {
      raw: "https://images.unsplash.com/photo-1679189788883-23275e29916a?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3",
      full: "https://images.unsplash.com/photo-1679189788883-23275e29916a?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=85",
      regular:
        "https://images.unsplash.com/photo-1679189788883-23275e29916a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=1080",
      small:
        "https://images.unsplash.com/photo-1679189788883-23275e29916a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=400",
      thumb:
        "https://images.unsplash.com/photo-1679189788883-23275e29916a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=200",
      small_s3:
        "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1679189788883-23275e29916a",
    },
    links: {
      self: "https://api.unsplash.com/photos/H6qOxrWySSU",
      html: "https://unsplash.com/photos/H6qOxrWySSU",
      download:
        "https://unsplash.com/photos/H6qOxrWySSU/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
      download_location:
        "https://api.unsplash.com/photos/H6qOxrWySSU/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
    },
    likes: 32,
    liked_by_user: false,
    current_user_collections: [],
    sponsorship: null,
    topic_submissions: {
      experimental: {
        status: "rejected",
      },
      "textures-patterns": {
        status: "rejected",
      },
      wallpapers: {
        status: "rejected",
      },
      "3d-renders": {
        status: "rejected",
      },
    },
    user: {
      id: "0UgzHjITxzY",
      updated_at: "2023-04-04T14:47:05Z",
      username: "boliviainteligente",
      name: "BoliviaInteligente",
      first_name: "BoliviaInteligente",
      last_name: null,
      twitter_username: null,
      portfolio_url: null,
      bio: null,
      location: null,
      links: {
        self: "https://api.unsplash.com/users/boliviainteligente",
        html: "https://unsplash.com/@boliviainteligente",
        photos: "https://api.unsplash.com/users/boliviainteligente/photos",
        likes: "https://api.unsplash.com/users/boliviainteligente/likes",
        portfolio:
          "https://api.unsplash.com/users/boliviainteligente/portfolio",
        following:
          "https://api.unsplash.com/users/boliviainteligente/following",
        followers:
          "https://api.unsplash.com/users/boliviainteligente/followers",
      },
      profile_image: {
        small:
          "https://images.unsplash.com/profile-1670025355390-63cab1beb2f3image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
        medium:
          "https://images.unsplash.com/profile-1670025355390-63cab1beb2f3image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
        large:
          "https://images.unsplash.com/profile-1670025355390-63cab1beb2f3image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
      },
      instagram_username: null,
      total_collections: 0,
      total_likes: 0,
      total_photos: 554,
      accepted_tos: true,
      for_hire: false,
      social: {
        instagram_username: null,
        portfolio_url: null,
        twitter_username: null,
        paypal_email: null,
      },
    },
    exif: {
      make: null,
      model: null,
      name: null,
      exposure_time: null,
      aperture: null,
      focal_length: null,
      iso: null,
    },
    location: {
      name: null,
      city: null,
      country: null,
      position: {
        latitude: 0,
        longitude: 0,
      },
    },
    views: 490140,
    downloads: 3125,
  },
  {
    id: "d_XBH-eJjZc",
    created_at: "2023-03-16T02:31:04Z",
    updated_at: "2023-04-04T08:41:26Z",
    promoted_at: "2023-03-16T11:48:01Z",
    width: 6000,
    height: 4000,
    color: "#262626",
    blur_hash: "LNBfOyxZnhae%MfQf5f50fS3f,fl",
    description: null,
    alt_description: "a building with a bunch of signs on the side of it",
    urls: {
      raw: "https://images.unsplash.com/photo-1678933632108-0ea1b61b2082?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3",
      full: "https://images.unsplash.com/photo-1678933632108-0ea1b61b2082?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=85",
      regular:
        "https://images.unsplash.com/photo-1678933632108-0ea1b61b2082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=1080",
      small:
        "https://images.unsplash.com/photo-1678933632108-0ea1b61b2082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=400",
      thumb:
        "https://images.unsplash.com/photo-1678933632108-0ea1b61b2082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=200",
      small_s3:
        "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1678933632108-0ea1b61b2082",
    },
    links: {
      self: "https://api.unsplash.com/photos/d_XBH-eJjZc",
      html: "https://unsplash.com/photos/d_XBH-eJjZc",
      download:
        "https://unsplash.com/photos/d_XBH-eJjZc/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
      download_location:
        "https://api.unsplash.com/photos/d_XBH-eJjZc/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
    },
    likes: 21,
    liked_by_user: false,
    current_user_collections: [],
    sponsorship: null,
    topic_submissions: {},
    user: {
      id: "YSTZkkK3V1o",
      updated_at: "2023-04-04T13:31:43Z",
      username: "mosdesign",
      name: "mos design",
      first_name: "mos",
      last_name: "design",
      twitter_username: null,
      portfolio_url: null,
      bio: "Hi  \r\nWell... Take your time.",
      location: "tokyo japan",
      links: {
        self: "https://api.unsplash.com/users/mosdesign",
        html: "https://unsplash.com/@mosdesign",
        photos: "https://api.unsplash.com/users/mosdesign/photos",
        likes: "https://api.unsplash.com/users/mosdesign/likes",
        portfolio: "https://api.unsplash.com/users/mosdesign/portfolio",
        following: "https://api.unsplash.com/users/mosdesign/following",
        followers: "https://api.unsplash.com/users/mosdesign/followers",
      },
      profile_image: {
        small:
          "https://images.unsplash.com/profile-1664189090215-f1cd1a693fbbimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
        medium:
          "https://images.unsplash.com/profile-1664189090215-f1cd1a693fbbimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
        large:
          "https://images.unsplash.com/profile-1664189090215-f1cd1a693fbbimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
      },
      instagram_username: null,
      total_collections: 0,
      total_likes: 150,
      total_photos: 377,
      accepted_tos: true,
      for_hire: true,
      social: {
        instagram_username: null,
        portfolio_url: null,
        twitter_username: null,
        paypal_email: null,
      },
    },
    exif: {
      make: "SONY",
      model: "ILCE-7M3",
      name: "SONY, ILCE-7M3",
      exposure_time: "1/125",
      aperture: "2.8",
      focal_length: "32.7",
      iso: 1250,
    },
    location: {
      name: "Tokyo Shinbashi, Japan",
      city: null,
      country: null,
      position: {
        latitude: 0,
        longitude: 0,
      },
    },
    views: 353448,
    downloads: 2660,
  },
  {
    id: "n2tAdx7Xpc0",
    created_at: "2023-03-18T03:01:20Z",
    updated_at: "2023-04-04T04:39:05Z",
    promoted_at: "2023-03-18T11:32:01Z",
    width: 7680,
    height: 4800,
    color: "#260c26",
    blur_hash: "LoE^TzS50}xGs-R*R*$*I;s,xGR-",
    description: null,
    alt_description: "a colorful abstract background with wavy lines",
    urls: {
      raw: "https://images.unsplash.com/photo-1679108316238-d8c188a66145?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3",
      full: "https://images.unsplash.com/photo-1679108316238-d8c188a66145?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=85",
      regular:
        "https://images.unsplash.com/photo-1679108316238-d8c188a66145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=1080",
      small:
        "https://images.unsplash.com/photo-1679108316238-d8c188a66145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=400",
      thumb:
        "https://images.unsplash.com/photo-1679108316238-d8c188a66145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=200",
      small_s3:
        "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1679108316238-d8c188a66145",
    },
    links: {
      self: "https://api.unsplash.com/photos/n2tAdx7Xpc0",
      html: "https://unsplash.com/photos/n2tAdx7Xpc0",
      download:
        "https://unsplash.com/photos/n2tAdx7Xpc0/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
      download_location:
        "https://api.unsplash.com/photos/n2tAdx7Xpc0/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
    },
    likes: 40,
    liked_by_user: false,
    current_user_collections: [],
    sponsorship: null,
    topic_submissions: {
      experimental: {
        status: "rejected",
      },
      "textures-patterns": {
        status: "rejected",
      },
      wallpapers: {
        status: "rejected",
      },
      "3d-renders": {
        status: "approved",
        approved_on: "2023-03-29T10:16:33Z",
      },
    },
    user: {
      id: "0UgzHjITxzY",
      updated_at: "2023-04-04T14:47:05Z",
      username: "boliviainteligente",
      name: "BoliviaInteligente",
      first_name: "BoliviaInteligente",
      last_name: null,
      twitter_username: null,
      portfolio_url: null,
      bio: null,
      location: null,
      links: {
        self: "https://api.unsplash.com/users/boliviainteligente",
        html: "https://unsplash.com/@boliviainteligente",
        photos: "https://api.unsplash.com/users/boliviainteligente/photos",
        likes: "https://api.unsplash.com/users/boliviainteligente/likes",
        portfolio:
          "https://api.unsplash.com/users/boliviainteligente/portfolio",
        following:
          "https://api.unsplash.com/users/boliviainteligente/following",
        followers:
          "https://api.unsplash.com/users/boliviainteligente/followers",
      },
      profile_image: {
        small:
          "https://images.unsplash.com/profile-1670025355390-63cab1beb2f3image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
        medium:
          "https://images.unsplash.com/profile-1670025355390-63cab1beb2f3image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
        large:
          "https://images.unsplash.com/profile-1670025355390-63cab1beb2f3image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
      },
      instagram_username: null,
      total_collections: 0,
      total_likes: 0,
      total_photos: 554,
      accepted_tos: true,
      for_hire: false,
      social: {
        instagram_username: null,
        portfolio_url: null,
        twitter_username: null,
        paypal_email: null,
      },
    },
    exif: {
      make: null,
      model: null,
      name: null,
      exposure_time: null,
      aperture: null,
      focal_length: null,
      iso: null,
    },
    location: {
      name: null,
      city: null,
      country: null,
      position: {
        latitude: 0,
        longitude: 0,
      },
    },
    views: 350045,
    downloads: 2723,
  },
  {
    id: "lhO_qdihypk",
    created_at: "2023-03-17T20:19:07Z",
    updated_at: "2023-04-04T04:39:04Z",
    promoted_at: "2023-03-18T11:48:01Z",
    width: 5157,
    height: 2901,
    color: "#f38cc0",
    blur_hash: "LkQ$9}spRQn*}ZWVoLazEeWVozbH",
    description: "Imprint.",
    alt_description: "a pink background with a white plant on it",
    urls: {
      raw: "https://images.unsplash.com/photo-1679084185371-62a7dc4ffeff?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3",
      full: "https://images.unsplash.com/photo-1679084185371-62a7dc4ffeff?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=85",
      regular:
        "https://images.unsplash.com/photo-1679084185371-62a7dc4ffeff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=1080",
      small:
        "https://images.unsplash.com/photo-1679084185371-62a7dc4ffeff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=400",
      thumb:
        "https://images.unsplash.com/photo-1679084185371-62a7dc4ffeff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=200",
      small_s3:
        "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1679084185371-62a7dc4ffeff",
    },
    links: {
      self: "https://api.unsplash.com/photos/lhO_qdihypk",
      html: "https://unsplash.com/photos/lhO_qdihypk",
      download:
        "https://unsplash.com/photos/lhO_qdihypk/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
      download_location:
        "https://api.unsplash.com/photos/lhO_qdihypk/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
    },
    likes: 70,
    liked_by_user: false,
    current_user_collections: [],
    sponsorship: null,
    topic_submissions: {
      experimental: {
        status: "rejected",
      },
      health: {
        status: "unevaluated",
      },
      nature: {
        status: "rejected",
      },
      "textures-patterns": {
        status: "rejected",
      },
      wallpapers: {
        status: "approved",
        approved_on: "2023-03-22T10:22:33Z",
      },
      "arts-culture": {
        status: "rejected",
      },
      spirituality: {
        status: "unevaluated",
      },
    },
    user: {
      id: "2tXKaPcv9BI",
      updated_at: "2023-04-04T14:46:46Z",
      username: "marekpiwnicki",
      name: "Marek Piwnicki",
      first_name: "Marek",
      last_name: "Piwnicki",
      twitter_username: null,
      portfolio_url: "https://marpiwnicki.github.io",
      bio: "If you want to use my pics you need to: a) Respect the nature! b) Become vege! c) Be aware!  d) Stop polluting!\r\n(Just kidding. Thanks for using them in any form ❤️)",
      location: "Gdynia | Poland",
      links: {
        self: "https://api.unsplash.com/users/marekpiwnicki",
        html: "https://unsplash.com/@marekpiwnicki",
        photos: "https://api.unsplash.com/users/marekpiwnicki/photos",
        likes: "https://api.unsplash.com/users/marekpiwnicki/likes",
        portfolio: "https://api.unsplash.com/users/marekpiwnicki/portfolio",
        following: "https://api.unsplash.com/users/marekpiwnicki/following",
        followers: "https://api.unsplash.com/users/marekpiwnicki/followers",
      },
      profile_image: {
        small:
          "https://images.unsplash.com/profile-1604758536753-68fd6f23aaf7image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
        medium:
          "https://images.unsplash.com/profile-1604758536753-68fd6f23aaf7image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
        large:
          "https://images.unsplash.com/profile-1604758536753-68fd6f23aaf7image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
      },
      instagram_username: "marekpiwnicki",
      total_collections: 35,
      total_likes: 1569,
      total_photos: 2629,
      accepted_tos: true,
      for_hire: true,
      social: {
        instagram_username: "marekpiwnicki",
        portfolio_url: "https://marpiwnicki.github.io",
        twitter_username: null,
        paypal_email: null,
      },
    },
    exif: {
      make: "Canon",
      model: " EOS 6D",
      name: "Canon, EOS 6D",
      exposure_time: "2",
      aperture: "4.0",
      focal_length: "50.0",
      iso: 200,
    },
    location: {
      name: "Poland",
      city: null,
      country: "Poland",
      position: {
        latitude: 51.919438,
        longitude: 19.145136,
      },
    },
    views: 486165,
    downloads: 15333,
  },
  {
    id: "YPog8dqY114",
    created_at: "2023-03-19T15:40:34Z",
    updated_at: "2023-04-03T19:38:11Z",
    promoted_at: "2023-03-20T00:24:01Z",
    width: 4547,
    height: 3503,
    color: "#734026",
    blur_hash: "LLE2,*}?9F4:I9W=xut89ZI=xtxa",
    description: null,
    alt_description: "a desktop computer sitting on top of a wooden desk",
    urls: {
      raw: "https://images.unsplash.com/photo-1679240271915-75e78dafbdef?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3",
      full: "https://images.unsplash.com/photo-1679240271915-75e78dafbdef?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=85",
      regular:
        "https://images.unsplash.com/photo-1679240271915-75e78dafbdef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=1080",
      small:
        "https://images.unsplash.com/photo-1679240271915-75e78dafbdef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=400",
      thumb:
        "https://images.unsplash.com/photo-1679240271915-75e78dafbdef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=200",
      small_s3:
        "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1679240271915-75e78dafbdef",
    },
    links: {
      self: "https://api.unsplash.com/photos/YPog8dqY114",
      html: "https://unsplash.com/photos/YPog8dqY114",
      download:
        "https://unsplash.com/photos/YPog8dqY114/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
      download_location:
        "https://api.unsplash.com/photos/YPog8dqY114/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
    },
    likes: 37,
    liked_by_user: false,
    current_user_collections: [],
    sponsorship: null,
    topic_submissions: {},
    user: {
      id: "MFLNKclsKAE",
      updated_at: "2023-04-02T22:17:21Z",
      username: "ilyacreates",
      name: "ilya",
      first_name: "ilya",
      last_name: null,
      twitter_username: "ilyacreates",
      portfolio_url: null,
      bio: "designer",
      location: "Edinburgh, Scotland",
      links: {
        self: "https://api.unsplash.com/users/ilyacreates",
        html: "https://unsplash.com/@ilyacreates",
        photos: "https://api.unsplash.com/users/ilyacreates/photos",
        likes: "https://api.unsplash.com/users/ilyacreates/likes",
        portfolio: "https://api.unsplash.com/users/ilyacreates/portfolio",
        following: "https://api.unsplash.com/users/ilyacreates/following",
        followers: "https://api.unsplash.com/users/ilyacreates/followers",
      },
      profile_image: {
        small:
          "https://images.unsplash.com/profile-1601304088082-4c573e3e1f21image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
        medium:
          "https://images.unsplash.com/profile-1601304088082-4c573e3e1f21image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
        large:
          "https://images.unsplash.com/profile-1601304088082-4c573e3e1f21image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
      },
      instagram_username: "ilyacreates",
      total_collections: 0,
      total_likes: 0,
      total_photos: 49,
      accepted_tos: true,
      for_hire: true,
      social: {
        instagram_username: "ilyacreates",
        portfolio_url: null,
        twitter_username: "ilyacreates",
        paypal_email: null,
      },
    },
    exif: {
      make: null,
      model: null,
      name: null,
      exposure_time: null,
      aperture: null,
      focal_length: null,
      iso: null,
    },
    location: {
      name: null,
      city: null,
      country: null,
      position: {
        latitude: null,
        longitude: null,
      },
    },
    views: 307730,
    downloads: 2436,
  },
  {
    id: "zisc8Tm2cjQ",
    created_at: "2023-03-31T12:37:18Z",
    updated_at: "2023-04-03T23:40:57Z",
    promoted_at: "2023-04-01T10:27:06Z",
    width: 4000,
    height: 3000,
    color: "#a6c0d9",
    blur_hash: "LJG,nwIzD*%h}~S%I9i]-;tSRjtR",
    description: null,
    alt_description: "a close up of three plastic corals on a table",
    urls: {
      raw: "https://images.unsplash.com/photo-1680266179692-a21c915b0b53?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3",
      full: "https://images.unsplash.com/photo-1680266179692-a21c915b0b53?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=85",
      regular:
        "https://images.unsplash.com/photo-1680266179692-a21c915b0b53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=1080",
      small:
        "https://images.unsplash.com/photo-1680266179692-a21c915b0b53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=400",
      thumb:
        "https://images.unsplash.com/photo-1680266179692-a21c915b0b53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=200",
      small_s3:
        "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1680266179692-a21c915b0b53",
    },
    links: {
      self: "https://api.unsplash.com/photos/zisc8Tm2cjQ",
      html: "https://unsplash.com/photos/zisc8Tm2cjQ",
      download:
        "https://unsplash.com/photos/zisc8Tm2cjQ/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
      download_location:
        "https://api.unsplash.com/photos/zisc8Tm2cjQ/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
    },
    likes: 22,
    liked_by_user: false,
    current_user_collections: [],
    sponsorship: null,
    topic_submissions: {
      "3d-renders": {
        status: "unevaluated",
      },
    },
    user: {
      id: "Fn9G4UNtFbY",
      updated_at: "2023-04-04T10:54:18Z",
      username: "allisonsaeng",
      name: "Allison Saeng",
      first_name: "Allison",
      last_name: "Saeng",
      twitter_username: null,
      portfolio_url: "https://www.behance.net/allisonsaeng",
      bio: "Creative and Designer ",
      location: "Remote working",
      links: {
        self: "https://api.unsplash.com/users/allisonsaeng",
        html: "https://unsplash.com/@allisonsaeng",
        photos: "https://api.unsplash.com/users/allisonsaeng/photos",
        likes: "https://api.unsplash.com/users/allisonsaeng/likes",
        portfolio: "https://api.unsplash.com/users/allisonsaeng/portfolio",
        following: "https://api.unsplash.com/users/allisonsaeng/following",
        followers: "https://api.unsplash.com/users/allisonsaeng/followers",
      },
      profile_image: {
        small:
          "https://images.unsplash.com/profile-1644189579276-23ef0268f169image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
        medium:
          "https://images.unsplash.com/profile-1644189579276-23ef0268f169image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
        large:
          "https://images.unsplash.com/profile-1644189579276-23ef0268f169image?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
      },
      instagram_username: "aomaunnada",
      total_collections: 28,
      total_likes: 0,
      total_photos: 1452,
      accepted_tos: true,
      for_hire: true,
      social: {
        instagram_username: "aomaunnada",
        portfolio_url: "https://www.behance.net/allisonsaeng",
        twitter_username: null,
        paypal_email: null,
      },
    },
    exif: {
      make: null,
      model: null,
      name: null,
      exposure_time: null,
      aperture: null,
      focal_length: null,
      iso: null,
    },
    location: {
      name: null,
      city: null,
      country: null,
      position: {
        latitude: 0,
        longitude: 0,
      },
    },
    views: 104716,
    downloads: 1670,
  },
  {
    id: "orp-cbFAGA4",
    created_at: "2023-03-21T10:02:12Z",
    updated_at: "2023-04-03T19:38:13Z",
    promoted_at: "2023-03-21T19:44:48Z",
    width: 5640,
    height: 3760,
    color: "#260c0c",
    blur_hash: "L47wm4_10g9Ht*tQpGE2ApIC;5$j",
    description: null,
    alt_description: "a close up of a bunch of red roses",
    urls: {
      raw: "https://images.unsplash.com/photo-1679390248331-c258a5b30f89?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3",
      full: "https://images.unsplash.com/photo-1679390248331-c258a5b30f89?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=85",
      regular:
        "https://images.unsplash.com/photo-1679390248331-c258a5b30f89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=1080",
      small:
        "https://images.unsplash.com/photo-1679390248331-c258a5b30f89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=400",
      thumb:
        "https://images.unsplash.com/photo-1679390248331-c258a5b30f89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=200",
      small_s3:
        "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1679390248331-c258a5b30f89",
    },
    links: {
      self: "https://api.unsplash.com/photos/orp-cbFAGA4",
      html: "https://unsplash.com/photos/orp-cbFAGA4",
      download:
        "https://unsplash.com/photos/orp-cbFAGA4/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
      download_location:
        "https://api.unsplash.com/photos/orp-cbFAGA4/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
    },
    likes: 33,
    liked_by_user: false,
    current_user_collections: [],
    sponsorship: null,
    topic_submissions: {},
    user: {
      id: "SXGirlnLn7s",
      updated_at: "2023-04-03T07:55:23Z",
      username: "iriser",
      name: "Irina Iriser",
      first_name: "Irina",
      last_name: "Iriser",
      twitter_username: "iriser_k",
      portfolio_url: "https://linktr.ee/Iriser",
      bio: "Photographer, singer. Thank you for visiting my profile ♡ ",
      location: "Ukraine",
      links: {
        self: "https://api.unsplash.com/users/iriser",
        html: "https://unsplash.com/@iriser",
        photos: "https://api.unsplash.com/users/iriser/photos",
        likes: "https://api.unsplash.com/users/iriser/likes",
        portfolio: "https://api.unsplash.com/users/iriser/portfolio",
        following: "https://api.unsplash.com/users/iriser/following",
        followers: "https://api.unsplash.com/users/iriser/followers",
      },
      profile_image: {
        small:
          "https://images.unsplash.com/profile-1596582072069-af0c0c8a0adbimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
        medium:
          "https://images.unsplash.com/profile-1596582072069-af0c0c8a0adbimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
        large:
          "https://images.unsplash.com/profile-1596582072069-af0c0c8a0adbimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
      },
      instagram_username: "iriser_ph",
      total_collections: 22,
      total_likes: 3034,
      total_photos: 435,
      accepted_tos: true,
      for_hire: false,
      social: {
        instagram_username: "iriser_ph",
        portfolio_url: "https://linktr.ee/Iriser",
        twitter_username: "iriser_k",
        paypal_email: null,
      },
    },
    exif: {
      make: null,
      model: null,
      name: null,
      exposure_time: null,
      aperture: null,
      focal_length: null,
      iso: null,
    },
    location: {
      name: null,
      city: null,
      country: null,
      position: {
        latitude: 0,
        longitude: 0,
      },
    },
    views: 155259,
    downloads: 1850,
  },
  {
    id: "IRi34LiL4uY",
    created_at: "2023-03-02T16:05:37Z",
    updated_at: "2023-04-04T12:39:57Z",
    promoted_at: "2023-03-06T19:56:02Z",
    width: 5374,
    height: 3249,
    color: "#c0c0c0",
    blur_hash: "LpKB2cM{xZaf.TR*oeRkD%xZoKWB",
    description: null,
    alt_description: "a large sand dune in the middle of a desert",
    urls: {
      raw: "https://images.unsplash.com/photo-1677773079710-8e5b50bf9344?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3",
      full: "https://images.unsplash.com/photo-1677773079710-8e5b50bf9344?crop=entropy&cs=srgb&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=85",
      regular:
        "https://images.unsplash.com/photo-1677773079710-8e5b50bf9344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=1080",
      small:
        "https://images.unsplash.com/photo-1677773079710-8e5b50bf9344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=400",
      thumb:
        "https://images.unsplash.com/photo-1677773079710-8e5b50bf9344?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg&ixlib=rb-4.0.3&q=80&w=200",
      small_s3:
        "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1677773079710-8e5b50bf9344",
    },
    links: {
      self: "https://api.unsplash.com/photos/IRi34LiL4uY",
      html: "https://unsplash.com/photos/IRi34LiL4uY",
      download:
        "https://unsplash.com/photos/IRi34LiL4uY/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
      download_location:
        "https://api.unsplash.com/photos/IRi34LiL4uY/download?ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODA2MTk5MDg",
    },
    likes: 81,
    liked_by_user: false,
    current_user_collections: [],
    sponsorship: null,
    topic_submissions: {},
    user: {
      id: "wPFDhDjtAdc",
      updated_at: "2023-04-04T13:11:42Z",
      username: "eamonn7777",
      name: "Eamonn Wang",
      first_name: "Eamonn",
      last_name: "Wang",
      twitter_username: null,
      portfolio_url: null,
      bio: null,
      location: null,
      links: {
        self: "https://api.unsplash.com/users/eamonn7777",
        html: "https://unsplash.com/@eamonn7777",
        photos: "https://api.unsplash.com/users/eamonn7777/photos",
        likes: "https://api.unsplash.com/users/eamonn7777/likes",
        portfolio: "https://api.unsplash.com/users/eamonn7777/portfolio",
        following: "https://api.unsplash.com/users/eamonn7777/following",
        followers: "https://api.unsplash.com/users/eamonn7777/followers",
      },
      profile_image: {
        small:
          "https://images.unsplash.com/profile-1675586536659-ca7c41b6883aimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32",
        medium:
          "https://images.unsplash.com/profile-1675586536659-ca7c41b6883aimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64",
        large:
          "https://images.unsplash.com/profile-1675586536659-ca7c41b6883aimage?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128",
      },
      instagram_username: "eamonn_wang",
      total_collections: 1,
      total_likes: 12,
      total_photos: 128,
      accepted_tos: true,
      for_hire: false,
      social: {
        instagram_username: "eamonn_wang",
        portfolio_url: null,
        twitter_username: null,
        paypal_email: null,
      },
    },
    exif: {
      make: "FUJIFILM",
      model: "X-T20",
      name: "FUJIFILM, X-T20",
      exposure_time: "1/350",
      aperture: "11.0",
      focal_length: "16.0",
      iso: 200,
    },
    location: {
      name: "Sahara Desert",
      city: null,
      country: null,
      position: {
        latitude: 23.416203,
        longitude: 25.66283,
      },
    },
    views: 2851668,
    downloads: 14058,
  },
];
