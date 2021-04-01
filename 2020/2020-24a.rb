def _input()
	File.open('2020-24-input').read.split("\n")
	# File.open('2020-24-test').read.split("\n")
end

floor = [ # 0 = white, 1 = black
	(1..300).map { [0] * 600 },
	(1..300).map { [0] * 600 }
]
XSHIFT = floor[0][0].size / 2
YSHIFT = floor[0].size / 2

def process_tile(f, s)
	s.reverse!
	x = XSHIFT
	y = YSHIFT

	while s.size > 0
		case s.pop
		when 'w' # ←
			x -= 2
		when 'e' # →
			x += 2
		when 's' # ↓
			y += 1
			x += s.pop == 'w' ? -1 : 1
		when 'n' # ↑
			y -= 1
			x += s.pop == 'w' ? -1 : 1
		end
	end

	f[y][x] = 1 - f[y][x]
end

def process_day(f, n)
	fc = f[n]
	for y in (1..YSHIFT*2-2)
		x = y % 2
		for xx in (1..XSHIFT-2)
			x += 2
			adj = fc[y-1][x-1] + fc[y-1][x+1] + fc[y][x-2] + fc[y][x+2] + fc[y+1][x-1] + fc[y+1][x+1]

			# Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
			# Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
			# 0123456
			# w-bwwww

			f[1-n][y][x] = adj == 1 ? f[n][y][x] : adj == 2 ? 1 : 0
		end
	end
end

def floor_sum(f)
	f.map(&:sum).sum
end

_input.each { |s| process_tile floor[1], s.split('') }

#1
p floor_sum floor[1]

#2
for day in (1..100)
	n = day % 2
	process_day(floor, n)
	p "day #{day}: #{floor_sum floor[1-n]}"
end
