"""Per-map choices for the OSM layout pass (what to route lanes along, which OSM buildings to raise in first person).
Lane = list of steps: ('pt', x, y) fixed point (off-map entries, landings, the HQ gate) or ('net', x, y) = follow the OSM
footway/road network from the previous point to the network node nearest (x, y). Coordinates are game px (4416 x 2976)."""

LANES = {
    'morro': [
        # (0) Calle del Morro: the paved esplanade walk from the city edge to the roundel, over the moat bridge to the gate
        [('pt', -160, 1478), ('net', 40, 1478), ('net', 2350, 1600), ('pt', 2350, 1600)],
        # (1) landing on the north-shore rocks below the cemetery wall, up the scrub to the trail along the outside of the
        #     city wall, then the counterscarp footpath beside the moat up to the roundel and over the bridge
        [('pt', 2000, 3140), ('pt', 1965, 2880), ('pt', 1800, 2620), ('net', 1720, 2420), ('net', 2350, 1600), ('pt', 2350, 1600)],
        # (2) from the Ballaja side (Calle Norzagaray) down the service road to the gate in the esplanade fence, along the worn
        #     footpath across the lawn to Calle del Morro, then the walk (shared with lane 0) to the bridge
        [('pt', 800, -140), ('pt', 756, 82), ('net', 616, 288), ('net', 2350, 1600), ('pt', 2350, 1600)],
    ],
    'tropical': [
        # (0) down the Palo Seco causeway road (Calle Manuel Enriquez / PR-870) onto the island to the HQ lawn
        [('pt', -140, 140), ('net', 30, 160), ('net', 1950, 1280), ('pt', 1950, 1280)],
        # (1) in along the park loop road from the north end of the island, west along the main park road; it leaves the road
        # east of the HQ and crosses the lawn straight to the gate (the road itself swings south round the HQ, which put the
        # last 30 m out of reach of a destroyer in the bay)
        [('pt', 4560, 744), ('net', 4400, 740), ('net', 2250, 1241), ('pt', 1950, 1280)],
        None,  # (2) amphibious landing from the bay over the breakwater: water, no road to follow -> unchanged
    ],
}
# highway classes lanes may follow
LANE_KINDS = {'footway', 'steps', 'pedestrian', 'path', 'service', 'tertiary', 'residential', 'unclassified', 'track', 'living_street', 'secondary', 'primary'}

# OSM buildings inside the playable maps that first person draws (and that are solid / unbuildable). Others are either the
# forts the lidar meshes already model, or mis-tagged features. kind: 'magazine' (gabled vault inside an enclosure wall),
# 'ruin' (roofless perimeter walls), 'battery' (low solid masonry platform), 'pavilion' (open hip-roof shelter on posts),
# 'hall' (closed building under a hip roof; supported, unused so far).
BUILDINGS = {
    'morro': {
        60252372: dict(kind='magazine', h=6.8, wall=2.6),          # Polvorin de Santa Elena (ruins, gabled, 2 levels)
        1024680661: dict(kind='battery', h=2.4),                  # Bateria (defensive_works=battery) on the bay-side lawn
        270181111: dict(kind='ruin', h=3.0),                      # Cuartel del Bastion de San Antonio (ruins)
        270181113: dict(kind='ruin', h=3.0),                      # Cuerpo de Guardia del Bastion Santa Elena (ruins)
        # skipped: 561634537 Castillo + 1024680662/666/667 bastions (lidar fort mesh / terrain already model them)
    },
    'tropical': {
        529578924: dict(kind='pavilion', h=3.6, roof=3.6),         # main park pavilion: open sides, green hip roof with lantern
        530388985: dict(kind='pavilion', h=3.2, roof=2.4),         # beach pavilion, green hip roof with lantern
        530388980: dict(kind='pavilion', h=2.8, roof=1.6), 530388981: dict(kind='pavilion', h=2.8, roof=1.6),
        530388982: dict(kind='pavilion', h=2.8, roof=1.6), 530388983: dict(kind='pavilion', h=2.8, roof=1.6),
        # skipped: 203588975 Fortin San Juan de la Cruz (modelled from HABS drawings in cabras3d.ts);
        #          534199727 is the ferry pier deck at the causeway (tagged building=yes; flat, already in the lidar)
    },
}
# OSM features that never count as Old San Juan backdrop buildings (fortifications are terrain in the lidar)
BACKDROP_SKIP_TAGS = {'historic': {'castle', 'fort', 'citywalls'}, 'building': {'roof', 'ruins'}}
