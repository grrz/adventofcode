def _input()
	f = File.open('2020-20-input')
	# f = File.open('2020-20-test')
	f.read.split("\n\n").map { |l| a = l.split "\n"; [a.shift.gsub(/\d+/).to_a[0].to_i, a.map { |i| i.tr '.#', ' ·' }] }.to_h
end

TSIZE = 10
ISIZE = 8
# ISIZE = 10

# tiles: t_number → tile
tiles = _input
NTILES = Integer.sqrt tiles.keys.size
FSIZE = ISIZE*NTILES
# p "SIZE: #{NTILES}"
sides = {}			# tile → [sides]
sides_n = {}		# side → [tiles]
sides_nn = {}		# tile → num sides seen just once

# sides: t_number → [8 sides]
tiles.keys.each { |k|
	s1 = tiles[k].map { |t| t[0] }.join
	s3 = tiles[k].map { |t| t[-1] }.join

	sides[k] = [
		tiles[k][0], tiles[k][0].reverse, 	# top			→← 01
		tiles[k][-1], tiles[k][-1].reverse,	# bottom	→← 23
		s1, s1.reverse, 										# left  	↓↑ 45
		s3, s3.reverse											# right 	↓↑ 67
		# tiles[k][0].to_i(2), tiles[k][0].reverse.to_i(2), 	# top			→← 01
		# tiles[k][-1].to_i(2), tiles[k][-1].reverse.to_i(2),	# bottom	→← 23
		# s1.to_i(2), s1.reverse.to_i(2), 										# left  	↓↑ 45
		# s3.to_i(2), s3.reverse.to_i(2)											# right 	↓↑ 67
	]
}

# sides_n: side → [t_numbers]
sides.keys.each { |t|
	sides[t].each { |s|
		if sides_n[s]
			sides_n[s].push t
		else
			sides_n[s] = [t]
		end
	}
}

# sides_nn: t_number → edge sides
sides_n.filter { |s, t| t.size == 1 }.each { |s, t|
	if sides_nn[t[0]]
		sides_nn[t[0]].push s
	else
		sides_nn[t[0]] = [s]
	end
}

#1
# p sides_nn.filter { |s, t| t.size == 4 }.map { |s, t| s }.reduce(1, :*)

#2

def pivot_tile(tiles, sides, tile, orientation)
	# p "pivot: #{tile}, #{orientation}"
	a = []
	case orientation
	when 0
		# 01234567
		return
	when 1
		# t← flip ←→
		tiles[tile].each(&:reverse!)
		a = [1,0,3,2,6,7,4,5]
	when 2
		# b→ flip ↓↑
		tiles[tile].reverse!
		a = [2,3,0,1,5,4,7,6]		
	when 3
		# b← rotate 180 || flip ←→ + flip ↓↑
		tiles[tile].each(&:reverse!)
		tiles[tile].reverse!
		a = [3,2,1,0,7,6,5,4]
	when 4
		# l↓ pivot /
		tiles[tile] = (0..TSIZE-1).map { |i| tiles[tile].map { |t| t[i] }.join }
		a = [4,5,6,7,0,1,2,3]
	when 5
		# l↑ flip ↓↑ + pivot /
		tiles[tile].reverse!
		tiles[tile] = (0..TSIZE-1).map { |i| tiles[tile].map { |t| t[i] }.join }
		a = [5,4,7,6,2,3,0,1]
	when 6
		# r↓ pivot / + flip ↓↑
		tiles[tile] = (0..TSIZE-1).to_a.reverse.map { |i| tiles[tile].map { |t| t[i] }.join }
		a = [6,7,4,5,1,0,3,2]
	when 7
		# r↑ pivot \
		tiles[tile] = (0..TSIZE-1).to_a.reverse.map { |i| tiles[tile].map { |t| t[i] }.reverse.join }
		a = [7,6,5,4,3,2,1,0]
	end
	sides[tile] = a.map { |i| sides[tile][i]}
end

def put_row(f, tiles, row, r)
	offsety = r * ISIZE
	offsetx = 0

	row.each { |t|
		oy = offsety
		# tiles[t].each { |tr|
		tiles[t][1..8].each { |tr|
			# f[oy][offsetx..(offsetx+ISIZE-1)] = tr
			f[oy][offsetx..(offsetx+ISIZE-1)] = tr[1..-2]
			oy += 1
		}
		offsetx += ISIZE
	}
end

# assemble field
# all variants of top-left sides; 0,4 is not rotated/flipped: top →, left ↓, for pivot_tile()
sidecombos = [[0,4], [1,6], [2,5], [3,7], [4,0], [5,2], [6,1], [7,3]]

# get corner tiles and put one to the start of first row
corners = sides_nn.filter { |s, t| t.size == 4 }.map { |s, t| s } # [2521, 2633, 3067, 1061]
rows = [[corners[0]]]

# pivot first tile so its found-once sides turn left and top
# p "y 1: #{rows[0][0]}, #{sides_nn[rows[0][0]]}"
pivot_tile tiles, sides, rows[0][0], (0..sidecombos.size-1).find { |i| sides_n[sides[rows[0][0]][sidecombos[i][0]]].size == 1 and sides_n[sides[rows[0][0]][sidecombos[i][1]]].size == 1 }

# find first tiles for each row
for y in 2..NTILES
	bound_tile = rows[-1][0]
	found_tile = sides_n[sides[bound_tile][2]].find { |i| i != bound_tile } # bottom →
	# p "y #{y}: #{found_tile}, #{sides_nn[found_tile]}"
	rows.push [found_tile]
	orientation = (0..sidecombos.size-1).find { |s| sides[found_tile][sidecombos[s][0]] == sides[bound_tile][2] }
	pivot_tile tiles, sides, found_tile, orientation
end

# find other tiles
for y in 0..NTILES-1
	for x in 1..NTILES-1
		bound_tile = rows[y][-1]
		found_tile = sides_n[sides[bound_tile][6]].find { |i| i != bound_tile } # right ↓
		# p "xy #{y}, #{x}: #{found_tile}"
		rows[y].push found_tile
		orientation = (0..sidecombos.size-1).find { |s| sides[found_tile][sidecombos[s][1]] == sides[bound_tile][6] }
		pivot_tile tiles, sides, found_tile, orientation
	end
end

# create and fill field
$f = (1..FSIZE).map { '0' * FSIZE }
for r in 0..rows.size-1
	put_row $f, tiles, rows[r], r
end

# p f

# find monsters

monster = [
	'                  # ',
	'#    ##    ##    ###',
	' #  #  #  #  #  #   '
].map { |s| s.tr ' #', '.·' }
MSIZE = monster[0].size
monster = monster.join(".{#{FSIZE - monster[0].size}}")
MROUGH = monster.count '·'
monster = '(?=(' + monster + '))'
# p "MONSTER: #{monster}"
monster = Regexp.new(monster)

def find_monsters(monster, iter)
	mm = $f.join('').gsub(monster).map { Regexp.last_match.begin(0) }
	mm = mm.filter { |m| m % FSIZE <= FSIZE - MSIZE }
	if mm.size > 0
		# mm.each { |m|	$f[m / FSIZE][m % FSIZE] = '•' }; p $f
		p "#{iter}: #{mm.size} #{mm} | roughness: #{ $f.join('').count('·') - MROUGH * mm.size }"
	end
end

def rotate_field
	$f = (0..FSIZE-1).to_a.reverse.map { |i| $f.map { |t| t[i] }.join }
	# p $f
end

find_monsters monster, 0

rotate_field
find_monsters monster, 1

rotate_field
find_monsters monster, 2

rotate_field
find_monsters monster, 3

$f.reverse!
find_monsters monster, 4

rotate_field
find_monsters monster, 5

rotate_field
find_monsters monster, 6

rotate_field
find_monsters monster, 7
