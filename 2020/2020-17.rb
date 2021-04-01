_input = '###...#.
.##.####
.####.##
###.###.
.##.####
#.##..#.
##.####.
.####.#.'.split("\n").map { |a| a.split('').map { |i| i == '#' ? 1 : 0 } }


$a = [-1,0,1]
# $a = $a.product($a, $a)
# $a.delete [0,0,0]
$a = $a.product($a, $a, $a)
$a.delete [0,0,0,0]

DIM = 30

def defa()
	s = []
	for x in 0..DIM-1
		sx = []
		for y in 0..DIM-1
			sy = []							# 4d
			for z in 0..DIM-1		#
				# sx.push([0] * DIM)
				sy.push([0] * DIM)
			end									# 
			sx.push sy					#
		end
		s.push sx
	end
	s
end

def filla(s, _input)
	# a = s[DIM / 2]
	a = s[DIM / 2][DIM / 2] # 4d
	offset = (DIM - _input.size) / 2
	for x in 0.._input.size-1
		a[x+offset][offset..offset+_input.size-1] = _input[x]
	end
end

def process(s, a)
	ss = s[a]
	sd = s[1-a]

	for x in 1..DIM-2
		for y in 1..DIM-2
			for z in 1..DIM-2
				for w in 1..DIM-2				# 4d
				# v = $a.map { |c| ss[x+c[0]][y+c[1]][z+c[2]] }.sum
				# sd[x][y][z] = v == 3 ? 1 : v == 2 ? ss[x][y][z] : 0
					v = $a.map { |c| ss[x+c[0]][y+c[1]][z+c[2]][w+c[3]] }.sum
					sd[x][y][z][w] = v == 3 ? 1 : v == 2 ? ss[x][y][z][w] : 0
				end											#
			end
		end
	end
end

def counta(s)
	v = 0
	for x in 1..DIM-2
		for y in 1..DIM-2
			for z in 1..DIM-2					# 4d
				# v += s[x][y].sum
				v += s[x][y][z].sum
			end												#
		end
	end
	v
end

s = []
s[0] = defa()
s[1] = defa()
filla s[0], _input

p = 0
for t in 0..5
	pp "step #{t+1}"
	process s, p
	p = 1 - p
end

pp counta s[p]
