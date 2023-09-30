import { useEffect } from 'react'
import { useUnderworldContext } from '../hooks/UnderworldContext'
import { useRealmMetadata, useRealmSvgMetadata } from '../hooks/useRealm'
import { compassToSlug } from '../utils/underworld'
import { bigintToHex } from '../utils/utils'

interface ChamberMapProps {
  realmId: number,
}

function RealmCitySelector({
  realmId,
}: ChamberMapProps) {
  const { cityIndex, dispatch, UnderworldActions } = useUnderworldContext()
  const { cities, svgData } = useRealmSvgMetadata(realmId)

  useEffect(() => {
    if (cityIndex === null && cities.length > 0) {
      _setSelectedCity(0)
    }
  }, [cityIndex, cities])

  const _setSelectedCity = (index: number) => {
    dispatch({
      type: UnderworldActions.SET_CITY_INDEX,
      payload: index,
    })
    dispatch({
      type: UnderworldActions.SET_CITY,
      payload: cities[index],
    })
  }

  return (
    <select value={cityIndex ?? 999} onChange={(e) => _setSelectedCity(parseInt(e.target.value))}>
      {cities.map((city: any, index: number) => {
        return <option value={index} key={city.name}>{city.description}</option>
      })}
    </select>
  )
}

function RealmData({
  realmId,
}: ChamberMapProps) {
  const { city } = useUnderworldContext()
  const { metadata } = useRealmMetadata(realmId)

  return (
    <div className='RealmData AlignTop'>
      <h1>
        {metadata.name}
      </h1>
      <h3>
        Realm #{realmId}
      </h3>

      City: <RealmCitySelector realmId={realmId} />

      {city.name &&
        <div>
          <p>
            Size: <b>{city.radius}</b>
          </p>
          <p>
            Elevation: <b>{city.elevation}</b>
          </p>
          <p>
            Compass: <b>{compassToSlug(city.compass)}</b>
          </p>
          <p>
            Coord: <b>{bigintToHex(city.coord)}</b>
          </p>
        </div>
      }
    </div>
  )
}

export default RealmData
